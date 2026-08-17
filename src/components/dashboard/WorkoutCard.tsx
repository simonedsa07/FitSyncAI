'use client';

import { SpotlightCard as Card } from '@/components/ui/SpotlightCard';
import { Button } from '@/components/ui/Button';
import { WorkoutDay } from '@/types/workout';
import Link from 'next/link';
import { LogoMark } from '@/components/layout/LogoMark';
import { cn } from '@/lib/utils';

interface WorkoutCardProps {
  day: WorkoutDay | null;
  onMarkDone: () => void;
}

const ACCENT_TEXT = { color: '#14121A' };
const ACCENT_TEXT_60 = { color: 'rgba(20,18,26,0.6)' };
const ACCENT_TEXT_70 = { color: 'rgba(20,18,26,0.7)' };

export function WorkoutCard({ day, onMarkDone }: WorkoutCardProps) {
  if (!day) {
    return (
      <Card accent className="flex flex-col justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide" style={ACCENT_TEXT_60}>
            TODAY · —
          </p>
          <h2 className="font-display text-2xl font-extrabold" style={ACCENT_TEXT}>
            No plan yet
          </h2>
        </div>
        <Link href="/workout" className="mt-6 w-fit">
          <Button variant="ghost">View full plan</Button>
        </Link>
      </Card>
    );
  }

  return (
    <Card accent>
      <div className="mb-4 flex items-start justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide" style={ACCENT_TEXT_60}>
            TODAY · {day.day}
          </p>
          <h2 className="font-display text-2xl font-extrabold" style={ACCENT_TEXT}>
            {day.title}
          </h2>
          <p className="mt-1 text-sm" style={ACCENT_TEXT_70}>
            {day.exercises.length} exercises · ~{day.est_calories} cal · {day.difficulty}
          </p>
        </div>
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl2 border-2 border-ink bg-white text-ink">
  <LogoMark size={22} />
</div>
      </div>

      <ul className="mb-6 space-y-2 text-sm" style={ACCENT_TEXT}>
        {day.exercises.map((ex) => (
          <li key={ex.id} className="flex items-center justify-between">
            <span>• {ex.name}</span>
            <span className="font-semibold">{ex.reps}</span>
          </li>
        ))}
      </ul>

      <div className="flex gap-3">
        <Link href="/workout">
          <Button variant="ghost">View full plan</Button>
        </Link>
        <Button
          variant={day.completed ? 'ghost' : 'accent'}
          onClick={onMarkDone}
          disabled={day.completed}
          className={cn(
            'transition-colors',
            day.completed && 'bg-teal hover:bg-teal text-white border-2 border-ink shadow-brutal-sm opacity-100 cursor-default'
          )}
        >
          {day.completed ? 'Done ✓' : '⊙ Mark done'}
        </Button>
      </div>
    </Card>
  );
}