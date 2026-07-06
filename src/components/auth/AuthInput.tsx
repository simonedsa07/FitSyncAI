import { InputHTMLAttributes } from 'react';
import { Input } from '@/components/ui/Input';

interface AuthInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export function AuthInput(props: AuthInputProps) {
  return <Input {...props} />;
}
