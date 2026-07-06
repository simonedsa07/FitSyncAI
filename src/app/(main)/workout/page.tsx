'use client';

import { useState } from 'react';
import { useWorkout } from '@/hooks/useWorkout';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { CalendarView } from '@/components/workout/CalendarView';
import { GeneratingOverlay } from '@/components/workout/GeneratingOverlay';
import { RegenerateModal } from '@/components/workout/RegenerateModal';
import { calcBmi } from '@/lib/utils';
import { goalLabel, goalIcon } from '@/lib/options';
import type { PlanCustomization } from '@/lib/openai';

export default function WorkoutPlanPage() {
  const { profile } = useAuth();
  const { plan, isGenerating, regenerate, completeDay } = useWorkout();
  const [modalOpen, setModalOpen] = useState(false);
  const bmi = calcBmi(profile?.height_cm ?? null, profile?.weight_kg ?? null);

  const currentGoalLabel = goalLabel(plan?.goal);
  const currentGoalIcon = goalIcon(plan?.goal);

  function handleGenerate(customization: PlanCustomization) {
    regenerate(customization);
  }

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-ink/50">Your week</p>
          <h1 className="font-display text-4xl font-extrabold">Workout Plan</h1>
          {plan && (
            <p className="mt-1 text-sm text-ink/60">
              BMI: <span className="font-bold">{bmi ?? '—'}</span> · Goal:{' '}
              <span className="font-bold">{currentGoalIcon} {currentGoalLabel}</span> ·
              Difficulty: <span className="font-bold">{plan.difficulty ?? 'Intermediate'}</span>
            </p>
          )}
        </div>
        <Button onClick={() => setModalOpen(true)} disabled={isGenerating}>
          ⟳ {isGenerating ? 'Generating…' : 'Regenerate'}
        </Button>
      </div>

      {!plan ? (
        <Card className="flex flex-col items-center gap-4 py-16 text-center">
          <p className="font-display text-xl font-extrabold">No plan yet.</p>
          <Button onClick={() => setModalOpen(true)} disabled={isGenerating}>
            {isGenerating ? 'Generating…' : 'Generate plan'}
          </Button>
        </Card>
      ) : (
        <CalendarView plan={plan} onComplete={completeDay} />
      )}

      <RegenerateModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleGenerate}
        currentDaysPerWeek={profile?.days_per_week}
      />

      {isGenerating && <GeneratingOverlay />}
    </div>
  );
}