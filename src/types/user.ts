export type Gender = 'male' | 'female' | 'other' | null;
export type Goal = 'fat_loss' | 'muscle_gain' | 'maintenance' | 'endurance';
export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  age: number | null;
  gender: Gender;
  height_cm: number | null;
  weight_kg: number | null;
  goal: Goal | null;
  activity_level: ActivityLevel | null;
  days_per_week: number | null;
  theme: string;
  onboarding_complete: boolean;
  created_at: string;
}
