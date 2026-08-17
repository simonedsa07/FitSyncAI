'use client';

import { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { cn } from '@/lib/utils';
import type { PlanCustomization } from '@/lib/openai';

const MUSCLE_OPTIONS = ['Chest', 'Back', 'Legs', 'Arms', 'Shoulders', 'Core', 'Full Body', 'Cardio'];
const INTENSITY_OPTIONS: { id: NonNullable<PlanCustomization['intensity']>; label: string }[] = [
  { id: 'low', label: 'Low' },
  { id: 'moderate', label: 'Moderate' },
  { id: 'high', label: 'High' },
];

interface RegenerateModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (customization: PlanCustomization) => void;
  currentDaysPerWeek?: number | null;
}

export function RegenerateModal({ open, onClose, onSubmit, currentDaysPerWeek }: RegenerateModalProps) {
  const [intensity, setIntensity] = useState<PlanCustomization['intensity']>();
  const [focusMuscles, setFocusMuscles] = useState<string[]>([]);
  const [days, setDays] = useState(String(currentDaysPerWeek ?? 4));
  const [notes, setNotes] = useState('');

  // Keep days in sync whenever the profile's days_per_week changes
  useEffect(() => {
    if (currentDaysPerWeek != null) {
      setDays(String(currentDaysPerWeek));
    }
  }, [currentDaysPerWeek]);

  function toggleMuscle(m: string) {
    setFocusMuscles((prev) => (prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m]));
  }

  function handleSubmit() {
    onSubmit({
      intensity,
      focus_muscles: focusMuscles.length ? focusMuscles : undefined,
      days_per_week: Number(days) || undefined,
      notes: notes.trim() || undefined,
    });
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose}>
      <h2 className="mb-4 font-display text-2xl font-extrabold">Customize your plan</h2>

      <div className="space-y-5">
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-wide text-ink/60">Intensity</p>
          <div className="flex gap-2">
            {INTENSITY_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setIntensity(opt.id)}
                className={cn('chip', intensity === opt.id && 'chip-active')}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-wide text-ink/60">
            Focus areas (optional)
          </p>
          <div className="flex flex-wrap gap-2">
            {MUSCLE_OPTIONS.map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => toggleMuscle(m)}
                className={cn('chip text-xs', focusMuscles.includes(m) && 'chip-active')}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        <Input
          label="Days per week"
          type="number"
          min={1}
          max={7}
          value={days}
          onChange={(e) => setDays(e.target.value)}
        />

        <div>
          <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-ink/70">
            Anything else? (optional)
          </label>
          <textarea
            className="brutal-input min-h-[80px] resize-none"
            placeholder="e.g. legs twice a week, avoid running, shorter sessions…"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            maxLength={300}
          />
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-3">
        <Button variant="ghost" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="dark" onClick={handleSubmit}>
          Generate plan
        </Button>
      </div>
    </Modal>
  );
}