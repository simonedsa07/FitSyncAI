import { AppBackground } from '@/components/layout/AppBackground';
import { DarkModeToggle } from '@/components/layout/DarkModeToggle';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-page text-ink relative overflow-hidden">
      <AppBackground />
      <div className="relative z-10">
        {children}
      </div>
      <DarkModeToggle />
    </div>
  );
}