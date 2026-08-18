import { create } from 'zustand';
import { WorkoutPlan } from '@/types/workout';

interface WorkoutState {
  plan: WorkoutPlan | null;
  isGenerating: boolean;
  selectedDay: string | null | undefined;
  setPlan: (plan: WorkoutPlan | null) => void;
  setGenerating: (val: boolean) => void;
  setSelectedDay: (day: string | null) => void;
  markDayComplete: (day: string) => void;
}

export const useWorkoutStore = create<WorkoutState>((set) => ({
  plan: null,
  isGenerating: false,
  selectedDay: undefined,
  setPlan: (plan) => set({ plan }),
  setGenerating: (isGenerating) => set({ isGenerating }),
  setSelectedDay: (selectedDay) => set({ selectedDay }),
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
