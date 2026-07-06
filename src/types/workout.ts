export interface Exercise {
  id: string;
  name: string;
  sets: number | null;
  reps: string;
  duration: string | null;
  est_calories: number;
}

export type DayLabel = 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT' | 'SUN';

export interface WorkoutDay {
  day: DayLabel;
  title: string;
  is_rest: boolean;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  est_calories: number;
  exercises: Exercise[];
  completed: boolean;
  note?: string;
}

export interface WorkoutPlan {
  id: string;
  user_id: string;
  week_start: string;
  bmi: number | null;
  goal: string;
  difficulty: string;
  days: WorkoutDay[];
  created_at: string;
}
