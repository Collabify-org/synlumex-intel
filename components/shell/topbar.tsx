'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Search, Bell, AlertTriangle, LogOut, User, CreditCard, Settings,
  ChevronDown
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import type { Profile } from '@/lib/types';

type Props = { profile: Profile | null };

export function Topbar({ profile }: Props) {
  const router = useRouter();
  const supabase = createClient();
  const [clock, setClock] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tick = () => {
      const d = new Date();
      setClock(
        d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) + ' UTC'
      );
    };
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [menuOpen]);

  async function signOut() {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  }

  const initial = profile?.full_name?.charAt(0)?.toUpperCase() ?? 'U';

  return (
    <header className="h-14 shrink-0 border-b border-border bg-card/30 flex items-center px-6 gap-4">
      <button className="flex items-center gap-2 rounded-md border border-border bg-background/50 px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:border-brand-cyan/40 transition-colors min-w-[280px]">
        <Search className="h-3.5 w-3.5" />
        <span>Search…</span>
        <span className="ml-auto font-mono text-[10px] opacity-60">⌘K</span>
      </button>

      <div className="ml-auto flex items-center gap-4">
        <span className="text-xs text-muted-foreground font-mono">
          Last sync: {clock}
        </span>

        <button className="relative text-muted-foreground hover:text-brand-cyan transition-colors">
          <Bell className="h-4 w-4" />
        </button>

        <button className="relative text-muted-foreground hover:text-brand-cyan transition-colors">
          <AlertTriangle className="h-4 w-4" />
        </button>

        <span className="text-[10px] font-mono font-semibold tracking-widest text-white rounded px-2 py-1 brand-gradient brand-glow">
          LIVE
        </span>

        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="flex items-center gap-2 rounded-md pl-1 pr-2 py-1 hover:bg-accent/40 transition-colors"
          >
            <div className="h-7 w-7 rounded-full brand-gradient flex items-center justify-center text-xs font-bold text-white">
              {initial}
            </div>
            <ChevronDown className="h-3 w-3 text-muted-foreground" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-full mt-2 w-64 rounded-lg border border-border bg-popover shadow-2xl overflow-hidden z-50">
              <div className="p-4 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full brand-gradient flex items-center justify-center text-sm font-bold text-white">
                    {initial}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-semibold truncate">
                      {profile?.full_name ?? 'User'}
                    </div>
                    <div className="text-[10px] font-mono text-muted-foreground truncate">
                      {profile?.email ?? ''}
                    </div>
                    <div className="text-[10px] font-mono text-brand-cyan capitalize mt-0.5">
                      {profile?.role ?? 'member'}
                    </div>
                  </div>
                </div>
              </div>

              <div className="py-1">
                <Link
                  href="/settings"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-accent/60 transition-colors"
                >
                  <User className="h-4 w-4 text-muted-foreground" />
                  Profile
                </Link>
                <Link
                  href="/account"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-accent/60 transition-colors"
                >
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                  Billing & Plan
                </Link>
                <Link
                  href="/settings"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-accent/60 transition-colors"
                >
                  <Settings className="h-4 w-4 text-muted-foreground" />
                  Settings
                </Link>
              </div>

              <div className="py-1 border-t border-border">
                <button
                  onClick={signOut}
                  className="flex items-center gap-3 px-4 py-2 text-sm w-full text-left hover:bg-destructive/10 text-destructive transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
