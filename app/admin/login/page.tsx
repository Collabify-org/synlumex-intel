'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Crown, Loader2 } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // If already logged in as super admin, go straight to /admin
  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('is_super_admin')
          .eq('id', user.id)
          .single();
        if (profile?.is_super_admin) {
          router.replace('/admin');
          return;
        }
      }
      if (mounted) setChecking(false);
    })();
    return () => {
      mounted = false;
    };
  }, [router, supabase]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    await supabase.auth.signOut();

    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('is_super_admin')
      .eq('id', data.user.id)
      .single();

    if (!profile?.is_super_admin) {
      await supabase.auth.signOut();
      setError('Access denied. This account is not a super admin.');
      setLoading(false);
      return;
    }

    router.replace('/admin');
    router.refresh();
  }

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-brand-cyan" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md px-6">
        <div className="flex flex-col items-center mb-10">
          <div className="h-16 w-16 rounded-xl flex items-center justify-center mb-4 brand-gradient brand-glow">
            <Crown className="h-8 w-8 text-white" strokeWidth={2.5} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">SYNLUMEX ADMIN</h1>
          <p className="text-sm text-muted-foreground mt-1 font-mono">
            Super Admin Console
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 card-glow">
          <div className="mb-6">
            <h2 className="text-lg font-semibold">Sign in</h2>
            <p className="text-xs text-muted-foreground mt-1">
              Restricted access. Only super admins can enter.
            </p>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-xs uppercase tracking-wider text-muted-foreground"
              >
                Admin Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@synlumex.ai"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                autoFocus
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-xs uppercase tracking-wider text-muted-foreground"
              >
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>

            {error && (
              <div className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full brand-gradient"
              disabled={loading}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sign in to Admin
            </Button>
          </form>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6 font-mono">
          Client?{' '}
          <a href="/login" className="text-brand-cyan hover:underline">
            Go to client login
          </a>
        </p>
      </div>
    </div>
  );
}
