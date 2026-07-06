import { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  accent?: boolean;
  children: ReactNode;
}

export function Card({ accent = false, className, children, ...props }: CardProps) {
  return (
    <div
      className={cn(accent ? 'brutal-card-accent' : 'brutal-card', 'p-6', className)}
      {...props}
    >
      {children}
    </div>
  );
}
