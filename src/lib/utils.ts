export function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

export function calcBmi(heightCm: number | null, weightKg: number | null) {
  if (!heightCm || !weightKg) return null;
  const heightM = heightCm / 100;
  return Math.round((weightKg / (heightM * heightM)) * 10) / 10;
}

export function formatDate(date: string | Date) {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit' }).replace('/', '-');
}

export const DAY_ORDER = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'] as const;

export function todayLabel() {
  const idx = (new Date().getDay() + 6) % 7; // Monday = 0
  return DAY_ORDER[idx];
}
import type { UserProfile } from '@/types/user';

const ACTIVITY_MULTIPLIER: Record<string, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
};

const GOAL_ADJUSTMENT: Record<string, number> = {
  fat_loss: -500,
  muscle_gain: 300,
  maintenance: 0,
  endurance: -200,
};

export function calculateBMR(profile: Partial<UserProfile>): number | null {
  const { age, height_cm, weight_kg, gender } = profile;
  if (!age || !height_cm || !weight_kg) return null;

  const base = 10 * weight_kg + 6.25 * height_cm - 5 * age;
  return gender === 'male' ? base + 5 : base - 161;
}

export function calculateDailyCalorieTarget(profile: Partial<UserProfile>): number | null {
  const bmr = calculateBMR(profile);
  if (!bmr) return null;

  const multiplier = ACTIVITY_MULTIPLIER[profile.activity_level ?? 'moderate'] ?? 1.55;
  const tdee = bmr * multiplier;
  const adjustment = GOAL_ADJUSTMENT[profile.goal ?? 'maintenance'] ?? 0;

  return Math.round(tdee + adjustment);
}

export function calculateWeeklyCalorieTarget(profile: Partial<UserProfile>): number | null {
  const daily = calculateDailyCalorieTarget(profile);
  return daily ? daily * 7 : null;
}