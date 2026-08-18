'use client';

import { WorkoutDay } from '@/types/workout';
import { ExerciseItem } from './ExerciseItem';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface DayCardProps {
  day: WorkoutDay;
  open: boolean;
  onToggle: () => void;
  onComplete: (day: string) => void;
}

export function DayCard({ day, open, onToggle, onComplete }: DayCardProps) {
  // Derived summary stats
  const totalExercises = day.exercises?.length ?? 0;
  const totalSets = day.exercises?.reduce((acc, ex) => acc + (ex.sets ?? 1), 0) ?? 0;
  const estMinutes = Math.round(totalExercises * 4.5); // ~4.5 min per exercise avg

  return (
    <div
      className={cn(
        'overflow-hidden border-2 border-ink rounded-card shadow-brutal',
        open ? 'brutal-card-accent' : 'bg-white'
      )}
    >
      <button onClick={onToggle} className="flex w-full items-center justify-between px-6 py-5 text-left">
        <div style={open ? { color: '#14121A' } : undefined}>
          <p
            className="text-xs font-bold uppercase tracking-wide"
            style={{ color: open ? 'rgba(20,18,26,0.6)' : undefined }}
          >
            {day.day}
          </p>
          <h3 className="font-display text-xl font-extrabold" style={open ? { color: '#14121A' } : undefined}>
            {day.title}
          </h3>
          <p
            className="mt-1 text-sm"
            style={{ color: open ? 'rgba(20,18,26,0.7)' : undefined }}
          >
            🔥 {day.est_calories} cal · {day.difficulty}
            {day.completed && <span className="ml-2 font-bold text-accent">✓ Done</span>}
          </p>
        </div>
        <span className="text-xl" style={open ? { color: '#14121A' } : undefined}>
          {open ? '︿' : '﹀'}
        </span>
      </button>

      {open && (
        <div className="space-y-3 px-6 pb-6">
          {day.is_rest ? (
            <p className="border-2 border-ink rounded-xl2 bg-white px-4 py-3 text-sm">
              {day.note ?? 'Rest & recover. Hydrate, stretch, sleep well 🛌'}
            </p>
          ) : (
            <>
              {day.exercises.map((ex) => (
                <ExerciseItem key={ex.id} exercise={ex} />
              ))}

              {/* ── Summary footer ── */}
              {totalExercises > 0 && (
                <div className="flex items-center justify-between rounded-xl2 border-2 border-ink/20 bg-white/60 px-4 py-2.5 text-xs font-semibold text-ink/60">
                  <span>📋 {totalExercises} exercises</span>
                  <span>⟳ {totalSets} sets total</span>
                  <span>⏱ ~{estMinutes} min</span>
                </div>
              )}

              <Button
                variant={day.completed ? 'ghost' : 'accent'}
                className={cn(
                  'w-full transition-colors',
                  day.completed && 'bg-accent hover:bg-accent text-white border-2 border-ink shadow-brutal-sm opacity-100 cursor-default'
                )}
                onClick={() => onComplete(day.day)}
                disabled={day.completed}
              >
                {day.completed ? 'Completed ✓' : '⊙ Mark complete'}
              </Button>
            </>
          )}
        </div>
      )}
    </div>
  );
}