'use client';

import { useEffect, useCallback } from 'react';
import { useUserStore } from '@/store/useUserStore';
import { useWorkoutStore } from '@/store/useWorkoutStore';
import { fetchCurrentPlan, generatePlan, markDayComplete } from '@/services/workoutService';
import type { PlanCustomization } from '@/lib/openai';
import { celebrate } from '@/lib/celebrate';

export function useWorkout() {
  const profile = useUserStore((s) => s.profile);
  const { plan, isGenerating, setPlan, setGenerating, markDayComplete: markLocal } =
    useWorkoutStore();

  useEffect(() => {
    if (!profile?.id) return;
    fetchCurrentPlan(profile.id).then(setPlan).catch(() => setPlan(null));
  }, [profile?.id, setPlan]);

  const regenerate = useCallback(
    async (customization?: PlanCustomization) => {
      setGenerating(true);
      try {
        const newPlan = await generatePlan(customization);
        setPlan(newPlan);
      } catch (err) {
        console.error('Failed to generate plan:', err);
        alert(err instanceof Error ? err.message : 'Failed to generate plan');
      } finally {
        setGenerating(false);
      }
    },
    [setGenerating, setPlan]
  );

 const completeDay = useCallback(
  async (day: string) => {
    if (!plan) return;
    markLocal(day);
    celebrate();
    try {
      await markDayComplete(plan.id, day);
    } catch (err) {
      console.error('Failed to persist workout completion:', err);
      alert(
        (err instanceof Error ? err.message : 'Failed to save progress') +
          ' — your change may not be saved permanently.'
      );
    }
  },
  [plan, markLocal]
);

  return { plan, isGenerating, regenerate, completeDay };
}