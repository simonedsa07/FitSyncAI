interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

const SYSTEM_PROMPT = `You are FitSync AI, an encouraging, knowledgeable fitness coach embedded in the FitSync app.
Keep answers short, practical, and motivating. You can discuss workouts, nutrition basics, recovery,
and how to use the app. Never give medical diagnoses; suggest a doctor for medical concerns.

Format your responses in clean Markdown:
- Use **bold** for key terms or headings, not entire sentences.
- Use "- " bullet lists (one item per line) instead of separating items with asterisks in a single paragraph.
- Use short paragraphs with blank lines between them instead of one long block of text.
- Keep it scannable — favor lists over dense prose when giving multiple items (e.g. meal ideas, exercises).`;

const NVIDIA_API_URL = 'https://integrate.api.nvidia.com/v1/chat/completions';
const DEFAULT_MODEL = 'meta/llama-3.1-8b-instruct';

export async function askFitSyncAI(messages: ChatMessage[]) {
  const apiKey = process.env.NVIDIA_API_KEY;
  if (!apiKey) {
    throw new Error('NVIDIA_API_KEY is not configured');
  }

  const model = process.env.NVIDIA_API_MODEL || DEFAULT_MODEL;

  const response = await fetch(NVIDIA_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...messages],
      temperature: 0.7,
      max_tokens: 400,
      stream: false,
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`NVIDIA API error (${response.status}): ${errText}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content ?? "Sorry, I couldn't process that. Try again.";
}
import type { WorkoutDay } from '@/types/workout';

interface PlanProfile {
  age: number | null;
  gender: string | null;
  height_cm: number | null;
  weight_kg: number | null;
  goal: string | null;
  activity_level: string | null;
  days_per_week: number | null;
}

export interface PlanCustomization {
  intensity?: 'low' | 'moderate' | 'high';
  focus_muscles?: string[];
  days_per_week?: number;
  notes?: string;
}

const PLAN_SYSTEM_PROMPT = `You are a certified strength & conditioning coach generating a 7-day workout plan.
Respond with ONLY valid JSON (no markdown fences, no commentary) matching this exact TypeScript shape:

{
  "days": [
    {
      "day": "MON" | "TUE" | "WED" | "THU" | "FRI" | "SAT" | "SUN",
      "title": string,
      "is_rest": boolean,
      "difficulty": "Beginner" | "Intermediate" | "Advanced",
      "est_calories": number,
      "exercises": [
        { "id": string, "name": string, "sets": number | null, "reps": string, "duration": string | null, "est_calories": number }
      ],
      "completed": false,
      "note": string (only include for rest days)
    }
  ]
}

Rules:
- Exactly 7 entries in "days", one per day of the week, in order MON..SUN.
- Rest days: is_rest true, exercises: [], est_calories: 0, include a short encouraging "note".
- Training days: 4-7 exercises, realistic sets/reps or duration, plausible est_calories per exercise.
- Vary exercise selection and structure meaningfully based on the person's goal, activity level, and any focus areas given — do not just alternate two templates.
- ids must be unique short strings like "e1", "e2".`;

export async function generateWorkoutPlanWithAI(
  profile: PlanProfile,
  customization?: PlanCustomization
): Promise<WorkoutDay[] | null> {
  const apiKey = process.env.NVIDIA_API_KEY;
  if (!apiKey) return null;

  const daysPerWeek = customization?.days_per_week ?? profile.days_per_week ?? 4;

  const briefLines = [
    `Age: ${profile.age ?? 'unknown'}`,
    `Gender: ${profile.gender ?? 'unspecified'}`,
    `Height: ${profile.height_cm ?? 'unknown'} cm, Weight: ${profile.weight_kg ?? 'unknown'} kg`,
    `Goal: ${profile.goal ?? 'general fitness'}`,
    `Activity level: ${profile.activity_level ?? 'moderate'}`,
    `Training days per week: ${daysPerWeek}`,
  ];
  if (customization?.intensity) briefLines.push(`Requested intensity: ${customization.intensity}`);
  if (customization?.focus_muscles?.length) {
    briefLines.push(`Focus muscle groups/areas this week: ${customization.focus_muscles.join(', ')}`);
  }
  if (customization?.notes) briefLines.push(`Additional request from the user: ${customization.notes}`);

  const userPrompt = `Build a 7-day plan for this person:\n${briefLines.join('\n')}`;

  try {
    const response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: process.env.NVIDIA_API_MODEL || 'meta/llama-3.1-8b-instruct',
        messages: [
          { role: 'system', content: PLAN_SYSTEM_PROMPT },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.8,
        max_tokens: 2000,
        stream: false,
      }),
    });

    if (!response.ok) {
      console.error('NVIDIA plan generation failed:', await response.text());
      return null;
    }

    const data = await response.json();
    const raw: string = data.choices?.[0]?.message?.content ?? '';
    const cleaned = raw.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(cleaned);

    if (!Array.isArray(parsed.days) || parsed.days.length !== 7) {
      console.error('AI plan response malformed:', parsed);
      return null;
    }

    return parsed.days as WorkoutDay[];
  } catch (err) {
    console.error('AI plan generation error:', err);
    return null;
  }
}