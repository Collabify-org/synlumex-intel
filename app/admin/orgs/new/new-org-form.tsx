'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Building2, Loader2, ShieldCheck, LogOut } from 'lucide-react';

type Plan = {
  id: string;
  name: string;
  price_monthly: number;
};

export function NewOrgForm({ plans }: { plans: Plan[] }) {
  const router = useRouter();
  const supabase = createClient();

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [slugTouched, setSlugTouched] = useState(false);
  const [planId, setPlanId] = useState(plans[0]?.id ?? 'pro');
  const [status, setStatus] = useState<'trialing' | 'active'>('trialing');
  const [trialDays, setTrialDays] = useState(14);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto-slug when name changes (unless user manually edited slug)
  function handleNameChange(val: string) {
    setName(val);
    if (!slugTouched) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '')
          .slice(0, 40)
      );
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!name.trim() || !slug.trim()) {
      setError('Name and slug are required.');
      setLoading(false);
      return;
    }

    // Check slug uniqueness
    const { data: existing } = await supabase
      .from('organizations')
      .select('id')
      .eq('slug', slug)
      .maybeSingle();

    if (existing) {
      setError('That slug is already taken. Try a different one.');
      setLoading(false);
      return;
    }

    const now = new Date();
    const trialEnds = status === 'trialing' ? new Date(now.getTime() + trialDays * 86400000) : null;
    const periodEnd = new Date(now.getTime() + 30 * 86400000);

    const { data, error: insertError } = await supabase
      .from('organizations')
      .insert({
        name: name.trim(),
        slug: slug.trim(),
        plan_id: planId,
        status,
        trial_ends_at: trialEnds?.toISOString() ?? null,
        current_period_start: now.toISOString(),
        current_period_end: periodEnd.toISOString()
      })
      .select()
      .single();

    if (insertError) {
      setError(insertError.message);
      setLoading(false);
      return;
    }

    router.push(`/admin/orgs/${data.id}`);
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Sticky admin topbar */}
      <header className="sticky top-0 z-40 h-14 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 flex items-center px-6">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg flex items-center justify-center brand-gradient brand-glow">
            <ShieldCheck className="h-4 w-4 text-white" strokeWidth={2.5} />
          </div>
          <div>
            <div className="text-sm font-bold tracking-tight">SYNLUMEX ADMIN</div>
            <div className="text-[10px] font-mono text-muted-foreground">
              Super Admin Console
            </div>
          </div>
        </div>
        <div className="ml-auto">
          <form action="/admin/signout" method="GET">
            <button
              type="submit"
              className="text-xs text-muted-foreground hover:text-destructive flex items-center gap-1 transition-colors"
            >
              <LogOut className="h-3 w-3" /> Sign out
            </button>
          </form>
        </div>
      </header>

      <div className="p-6 max-w-3xl mx-auto">
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="h-3 w-3" /> All Organizations
        </Link>

        <div className="flex items-center gap-4 mb-6">
          <div className="h-14 w-14 rounded-lg brand-gradient brand-glow flex items-center justify-center">
            <Building2 className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">New Organization</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Create a new client workspace on the platform
            </p>
          </div>
        </div>

        <Card className="p-6 bg-card/50">
          <form onSubmit={onSubmit} className="space-y-5">
            {/* Org name */}
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">
                Organization Name *
              </Label>
              <Input
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g., Adani Ports"
                required
                autoFocus
              />
            </div>

            {/* Slug */}
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">
                Slug * (URL-safe identifier)
              </Label>
              <Input
                value={slug}
                onChange={(e) => {
                  setSlugTouched(true);
                  setSlug(
                    e.target.value
                      .toLowerCase()
                      .replace(/[^a-z0-9-]+/g, '-')
                      .replace(/^-+|-+$/g, '')
                  );
                }}
                placeholder="adani-ports"
                required
              />
              <p className="text-[10px] font-mono text-muted-foreground">
                Must be unique · lowercase letters, numbers, hyphens only
              </p>
            </div>

            {/* Plan */}
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">
                Plan
              </Label>
              <div className="grid grid-cols-3 gap-2">
                {plans.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setPlanId(p.id)}
                    className={`rounded-md border p-3 text-left transition-all ${
                      planId === p.id
                        ? 'border-brand-cyan bg-brand/10'
                        : 'border-border bg-background/40 hover:border-brand-cyan/40'
                    }`}
                  >
                    <div className="text-xs font-semibold">{p.name}</div>
                    <div className="text-[10px] font-mono text-muted-foreground mt-0.5">
                      ₹{p.price_monthly.toLocaleString('en-IN')}/mo
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">
                Status
              </Label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setStatus('trialing')}
                  className={`flex-1 rounded-md border px-3 py-2 text-sm transition-all ${
                    status === 'trialing'
                      ? 'border-brand-cyan bg-brand/10'
                      : 'border-border bg-background/40 hover:border-brand-cyan/40'
                  }`}
                >
                  Trialing
                </button>
                <button
                  type="button"
                  onClick={() => setStatus('active')}
                  className={`flex-1 rounded-md border px-3 py-2 text-sm transition-all ${
                    status === 'active'
                      ? 'border-brand-cyan bg-brand/10'
                      : 'border-border bg-background/40 hover:border-brand-cyan/40'
                  }`}
                >
                  Active (Paid)
                </button>
              </div>
            </div>

            {/* Trial days (only if trialing) */}
            {status === 'trialing' && (
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-wider text-muted-foreground">
                  Trial Length (days)
                </Label>
                <div className="flex gap-2">
                  {[7, 14, 30, 90].map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setTrialDays(d)}
                      className={`flex-1 rounded-md border px-3 py-2 text-sm transition-all ${
                        trialDays === d
                          ? 'border-brand-cyan bg-brand/10'
                          : 'border-border bg-background/40 hover:border-brand-cyan/40'
                      }`}
                    >
                      {d} days
                    </button>
                  ))}
                </div>
              </div>
            )}

            {error && (
              <div className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive">
                {error}
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <Link href="/admin">
                <Button type="button" variant="ghost">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" disabled={loading} className="brand-gradient">
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Organization
              </Button>
            </div>
          </form>
        </Card>

        <div className="mt-6 rounded-md border border-border bg-card/30 p-4">
          <div className="text-[10px] font-mono tracking-widest text-muted-foreground uppercase mb-2">
            What happens next
          </div>
          <ol className="text-xs text-muted-foreground space-y-1 ml-4 list-decimal">
            <li>Organization is created with the selected plan</li>
            <li>You land on its detail page</li>
            <li>Add users from the detail page (coming next)</li>
            <li>They log in at /login and see a fresh empty workspace</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
