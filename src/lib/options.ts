import type { ActivityLevel, Goal } from '@/types/user';

export const GOAL_OPTIONS: { id: Goal; label: string; icon: string; hint: string }[] = [
  { id: 'fat_loss', label: 'Fat Loss', icon: '🔥', hint: 'Burn fat, lean out' },
  { id: 'muscle_gain', label: 'Muscle Gain', icon: '💪', hint: 'Build strength & size' },
  { id: 'maintenance', label: 'Maintenance', icon: '⚖️', hint: 'Stay consistent' },
  { id: 'endurance', label: 'Endurance', icon: '🏃', hint: 'Improve stamina' },
];

export const ACTIVITY_OPTIONS: { id: ActivityLevel; label: string; hint: string }[] = [
  { id: 'sedentary', label: 'Sedentary', hint: 'Little/no exercise' },
  { id: 'light', label: 'Light', hint: '1-2 days/week' },
  { id: 'moderate', label: 'Moderate', hint: '3-4 days/week' },
  { id: 'active', label: 'Active', hint: '5+ days/week' },
];

export function goalLabel(goal: Goal | string | null | undefined) {
  return GOAL_OPTIONS.find((g) => g.id === goal)?.label ?? 'Fat Loss';
}

export function goalIcon(goal: Goal | string | null | undefined) {
  return GOAL_OPTIONS.find((g) => g.id === goal)?.icon ?? '🔥';
}

export function activityLabel(level: ActivityLevel | string | null | undefined) {
  return ACTIVITY_OPTIONS.find((a) => a.id === level)?.label ?? 'Moderate';
}