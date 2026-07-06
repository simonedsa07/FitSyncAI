import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabaseServer';
import { calcBmi } from '@/lib/utils';
import { generateWorkoutPlanWithAI, PlanCustomization } from '@/lib/openai';
import { checkRateLimit } from '@/lib/rateLimit';
import type { WorkoutDay, Exercise } from '@/types/workout';

function ex(name: string, sets: number, reps: string, cal: number, id: string): Exercise {
  return { id, name, sets, reps, duration: null, est_calories: cal };
}

function cardioEx(name: string, duration: string, cal: number, id: string): Exercise {
  return { id, name, sets: null, reps: '', duration, est_calories: cal };
}

const DAY_LABELS: WorkoutDay['day'][] = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

function distributeTrainingDays(daysPerWeek: number): boolean[] {
  const total = 7;
  const clamped = Math.max(0, Math.min(total, daysPerWeek));
  const pattern: boolean[] = [];
  let acc = 0;
  for (let i = 0; i < total; i++) {
    acc += clamped;
    if (acc >= total) {
      acc -= total;
      pattern.push(true);
    } else {
      pattern.push(false);
    }
  }
  return pattern;
}

function buildFallbackWeek(daysPerWeek: number): WorkoutDay[] {
  const fullBody: Exercise[] = [
    ex('Burpees', 3, '10-15', 100, 'e1'),
    ex('Goblet Squats', 3, '12-15', 80, 'e2'),
    ex('Push-ups', 3, '10-12', 50, 'e3'),
    ex('Bent-over Rows', 3, '10-12', 60, 'e4'),
    ex('Plank', 3, '45-60s', 30, 'e5'),
    ex('Mountain Climbers', 3, '30s', 60, 'e6'),
    ex('Jump Rope', 4, '2 min', 80, 'e7'),
  ];
  const cardio: Exercise[] = [
    cardioEx('Jog / Run', '1×20-30 min', 250, 'c1'),
    cardioEx('Jump Rope', '4×2 min', 80, 'c2'),
    ex('High Knees', 3, '45s', 50, 'c3'),
    ex('Mountain Climbers', 3, '45s', 60, 'c4'),
  ];

  const trainingPattern = distributeTrainingDays(daysPerWeek);
  let trainingIndex = 0;

  return DAY_LABELS.map((day, i) => {
    const isTraining = trainingPattern[i];
    if (!isTraining) {
      return {
        day, title: 'Rest Day', is_rest: true, difficulty: 'Intermediate',
        est_calories: 0, exercises: [], completed: false,
        note: 'Rest & recover. Hydrate, stretch, sleep well 🛌',
      };
    }
    const type = trainingIndex % 2 === 0 ? 'full' : 'cardio';
    trainingIndex += 1;
    const exercises = type === 'full' ? fullBody : cardio;
    return {
      day,
      title: type === 'full' ? 'Full Body Day' : 'Cardio Day',
      is_rest: false,
      difficulty: 'Intermediate',
      est_calories: exercises.reduce((s, e) => s + e.est_calories, 0),
      exercises,
      completed: false,
    };
  });
}

export async function POST(request: NextRequest) {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const allowed = await checkRateLimit(user.id, 'workout-generate', 5, 60);
  if (!allowed) {
    return NextResponse.json({ error: 'Too many requests — please wait a moment.' }, { status: 429 });
  }

  let customization: PlanCustomization | undefined;
  try {
    const body = await request.json();
    customization = body?.customization;
  } catch {
    customization = undefined;
  }

  let { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle();

  if (!profile) {
    const { data: recreated, error: recreateError } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        name: user.user_metadata?.full_name ?? user.email?.split('@')[0] ?? 'User',
        email: user.email,
        onboarding_complete: false,
      })
      .select()
      .single();

    if (recreateError) {
      return NextResponse.json({ error: `Could not create profile: ${recreateError.message}` }, { status: 500 });
    }
    profile = recreated;
  }

  const safeDaysPerWeek = Math.max(1, Math.min(7, customization?.days_per_week ?? profile?.days_per_week ?? 4));

  let days = await generateWorkoutPlanWithAI(
    {
      age: profile?.age ?? null,
      gender: profile?.gender ?? null,
      height_cm: profile?.height_cm ?? null,
      weight_kg: profile?.weight_kg ?? null,
      goal: profile?.goal ?? null,
      activity_level: profile?.activity_level ?? null,
      days_per_week: safeDaysPerWeek,
    },
    customization
  );

  if (!days) {
    // AI failed or isn't configured — fall back to the deterministic generator
    // so plan generation always succeeds, just less personalized.
    days = buildFallbackWeek(safeDaysPerWeek);
  }

  const bmi = calcBmi(profile?.height_cm ?? null, profile?.weight_kg ?? null);

  const plan = {
    user_id: user.id,
    week_start: new Date().toISOString(),
    bmi,
    goal: profile?.goal ?? 'fat_loss',
    difficulty: 'Intermediate',
    days,
  };

  const { data: inserted, error } = await supabase
    .from('workout_plans')
    .insert(plan)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ plan: inserted });
}