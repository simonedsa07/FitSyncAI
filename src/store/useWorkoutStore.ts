import { create } from 'zustand';
import { WorkoutPlan } from '@/types/workout';

interface WorkoutState {
  plan: WorkoutPlan | null;
  isGenerating: boolean;
  setPlan: (plan: WorkoutPlan | null) => void;
  setGenerating: (val: boolean) => void;
  markDayComplete: (day: string) => void;
}

export const useWorkoutStore = create<WorkoutState>((set) => ({
  plan: null,
  isGenerating: false,
  setPlan: (plan) => set({ plan }),
  setGenerating: (isGenerating) => set({ isGenerating }),
  markDayComplete: (day) =>
    set((state) => {
      if (!state.plan) return state;
      return {
        plan: {
          ...state.plan,
          days: state.plan.days.map((d) =>
            d.day === day ? { ...d, completed: true } : d
          ),
        },
      };
    }),
}));
