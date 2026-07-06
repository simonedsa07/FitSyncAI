import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, className, id, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={id}
            className="mb-2 block text-xs font-bold uppercase tracking-wide text-ink/70"
          >
            {label}
          </label>
        )}
        <input id={id} ref={ref} className={cn('brutal-input', className)} {...props} />
      </div>
    );
  }
);

Input.displayName = 'Input';
