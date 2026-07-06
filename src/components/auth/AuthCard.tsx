import { ReactNode } from 'react';
import { LogoMark } from '@/components/layout/LogoMark';

interface AuthCardProps {
  eyebrow: string;
  children: ReactNode;
}

export function AuthCard({ eyebrow, children }: AuthCardProps) {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-md brutal-card p-8">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border-2 border-ink brutal-card-accent text-ink">
  <LogoMark size={26} />
</div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-ink/60">{eyebrow}</p>
            <h1 className="font-display text-2xl font-extrabold">
              FitSync<span style={{ color: 'var(--accent)' }}>AI</span>
            </h1>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}
