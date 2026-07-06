import { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

type Variant = 'accent' | 'dark' | 'ghost';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  icon?: ReactNode;
  children: ReactNode;
}

const variantClass: Record<Variant, string> = {
  accent: 'btn-pill-accent',
  dark: 'btn-pill-dark',
  ghost: 'btn-pill-ghost',
};

export function Button({
  variant = 'accent',
  icon,
  children,
  className,
  ...props
}: ButtonProps) {
  return (
    <button className={cn(variantClass[variant], className)} {...props}>
      {icon}
      {children}
    </button>
  );
}
