'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const NAV_LINKS = [
  { href: '/dashboard', label: 'Dashboard', icon: '🏠' },
  { href: '/workout', label: 'Plan', icon: '📅' },
  { href: '/progress', label: 'Progress', icon: '📈' },
  { href: '/profile', label: 'Profile', icon: '👤' },
];

// Bottom tab bar shown on small screens; the Navbar handles desktop nav.
export function Sidebar() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 flex justify-around border-t-2 border-ink bg-white py-2 md:hidden">
      {NAV_LINKS.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={cn(
            'flex flex-col items-center gap-0.5 rounded-xl2 px-3 py-1 text-xs font-semibold',
            pathname === link.href && 'brutal-card-accent'
          )}
        >
          <span>{link.icon}</span>
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
