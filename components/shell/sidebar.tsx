'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutGrid, FolderKanban, AlertTriangle, Banknote,
  Sparkles, Bell, ScrollText, Settings, ShieldCheck, CreditCard
} from 'lucide-react';
import type { Profile } from '@/lib/types';

type Props = { profile: Profile | null };

const NAV = {
  OPERATIONS: [
    { href: '/dashboard', label: 'Command Center', icon: LayoutGrid },
    { href: '/projects', label: 'Projects', icon: FolderKanban },
    { href: '/exceptions', label: 'Exceptions', icon: AlertTriangle },
    { href: '/commercial', label: 'Commercial', icon: Banknote }
  ],
  INTELLIGENCE: [
    { href: '/intelligence', label: 'Intelligence', icon: Sparkles },
    { href: '/reminders', label: 'Reminders', icon: Bell }
  ],
  SYSTEM: [
    { href: '/audit', label: 'Audit Log', icon: ScrollText },
    { href: '/account', label: 'Account', icon: CreditCard },
    { href: '/settings', label: 'Settings', icon: Settings }
  ]
};

export function Sidebar({ profile }: Props) {
  const path = usePathname();

  return (
    <aside className="w-60 shrink-0 border-r border-border bg-card/30 flex flex-col h-screen">
      <div className="h-14 flex items-center gap-2 px-4 border-b border-border">
        <div className="h-8 w-8 rounded-lg flex items-center justify-center brand-gradient brand-glow">
          <ShieldCheck className="h-4 w-4 text-white" strokeWidth={2.5} />
        </div>
        <div className="flex flex-col leading-none">
          <span className="text-sm font-bold tracking-tight">SYNLUMEX</span>
          <span className="text-[10px] font-mono text-muted-foreground tracking-widest">INTEL</span>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-3">
        {Object.entries(NAV).map(([section, items]) => (
          <div key={section} className="mb-6">
            <div className="px-3 mb-2 text-[10px] font-mono tracking-widest text-muted-foreground/70">
              {section}
            </div>
            {items.map((item) => {
              const active = path === item.href || path.startsWith(item.href + '/');
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-all relative',
                    active
                      ? 'bg-brand/10 text-foreground'
                      : 'text-muted-foreground hover:bg-accent/40 hover:text-foreground'
                  )}
                >
                  {active && (
                    <span className="absolute left-0 top-1.5 bottom-1.5 w-0.5 rounded-r brand-gradient" />
                  )}
                  <Icon className={cn('h-4 w-4', active && 'text-brand-cyan')} />
                  {item.label}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="border-t border-border p-3">
        <div className="flex items-center gap-3 px-2">
          <div className="h-8 w-8 rounded-full brand-gradient flex items-center justify-center text-xs font-bold text-white">
            {profile?.full_name?.charAt(0) ?? 'U'}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-medium truncate">{profile?.full_name ?? 'User'}</div>
            <div className="text-[10px] text-muted-foreground capitalize font-mono">
              {profile?.role ?? 'member'}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
