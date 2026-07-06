import { Exercise } from '@/types/workout';

export function ExerciseItem({ exercise }: { exercise: Exercise }) {
  return (
    <div className="flex items-center justify-between border-2 border-ink rounded-xl2 bg-white px-4 py-3">
      <div>
        <p className="font-bold text-ink">{exercise.name}</p>
        <p className="text-xs text-ink/50">~{exercise.est_calories} cal</p>
      </div>
      <p className="font-bold text-ink/80">
        {exercise.duration ?? `${exercise.sets} × ${exercise.reps}`}
      </p>
    </div>
  );
}