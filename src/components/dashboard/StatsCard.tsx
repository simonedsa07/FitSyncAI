import { ReactNode } from 'react';
import { SpotlightCard } from '@/components/ui/SpotlightCard';
import { CountUp } from '@/components/ui/CountUp';

interface StatsCardProps {
  icon: ReactNode;
  label: string;
  value: number | string | ReactNode;
  suffix?: string;
  footer?: ReactNode;
}

export function StatsCard({ icon, label, value, suffix, footer }: StatsCardProps) {
  return (
    <SpotlightCard>
      <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-ink/60">
        {icon}
        {label}
      </div>
      <p className="font-display text-4xl font-extrabold">
        {typeof value === 'number' ? <CountUp value={value} /> : value}
        {suffix && <span className="ml-1 text-lg font-semibold text-ink/50">{suffix}</span>}
      </p>
      {footer && <div className="mt-2 text-sm text-ink/60">{footer}</div>}
    </SpotlightCard>
  );
}