'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Loader2, Calendar, Trash2, RefreshCw, Zap, Crown } from 'lucide-react';

const PLANS = [
  { id: 'starter', name: 'Starter' },
  { id: 'pro', name: 'Pro' },
  { id: 'enterprise', name: 'Enterprise' }
];

export function OrgActions({
  orgId,
  currentPlanId
}: {
  orgId: string;
  currentPlanId: string;
}) {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function changePlan(newPlanId: string) {
    setLoading(`plan-${newPlanId}`);
    setError(null);
    setNotice(null);
    try {
      const { data: { user } } = await supabase.auth.getUser();

      await supabase.from('subscription_history').insert({
        subscription_id: orgId,
        old_plan_id: currentPlanId,
        new_plan_id: newPlanId,
        changed_by: user?.id,
        reason: 'Manual plan change from admin panel'
      });

      const { error } = await supabase
        .from('organizations')
        .update({
          plan_id: newPlanId,
          status: 'active',
          current_period_start: new Date().toISOString(),
          current_period_end: new Date(Date.now() + 30 * 86400000).toISOString(),
          trial_ends_at: null,
          updated_at: new Date().toISOString()
        })
        .eq('id', orgId);

      if (error) throw error;
      setNotice(`Switched to ${newPlanId}`);
      router.refresh();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(null);
    }
  }

  async function extendTrial(days: number) {
    setLoading(`trial-${days}`);
    setError(null);
    setNotice(null);
    try {
      const { error } = await supabase
        .from('organizations')
        .update({
          trial_ends_at: new Date(Date.now() + days * 86400000).toISOString(),
          status: 'trialing',
          updated_at: new Date().toISOString()
        })
        .eq('id', orgId);
      if (error) throw error;
      setNotice(`Trial extended by ${days} days`);
      router.refresh();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(null);
    }
  }

  async function resetPeriod() {
    setLoading('reset');
    setError(null);
    setNotice(null);
    try {
      const { error } = await supabase
        .from('organizations')
        .update({
          current_period_start: new Date().toISOString(),
          current_period_end: new Date(Date.now() + 30 * 86400000).toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', orgId);
      if (error) throw error;
      setNotice('Billing period reset');
      router.refresh();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(null);
    }
  }

  async function clearUsage() {
    setLoading('clear-usage');
    setError(null);
    setNotice(null);
    try {
      const { error } = await supabase
        .from('usage_events')
        .delete()
        .eq('organization_id', orgId);
      if (error) throw error;
      setNotice('Usage events cleared for this org');
      router.refresh();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <div className="text-xs font-mono tracking-widest text-muted-foreground uppercase mb-2">
          Switch Plan
        </div>
        <div className="flex flex-wrap gap-2">
          {PLANS.map((p) => {
            const isCurrent = p.id === currentPlanId;
            return (
              <Button
                key={p.id}
                variant={isCurrent ? 'outline' : 'default'}
                size="sm"
                disabled={isCurrent || loading === `plan-${p.id}`}
                onClick={() => changePlan(p.id)}
                className={!isCurrent ? 'brand-gradient' : ''}
              >
                {loading === `plan-${p.id}` && <Loader2 className="mr-2 h-3 w-3 animate-spin" />}
                {isCurrent ? `${p.name} (Current)` : `Switch to ${p.name}`}
              </Button>
            );
          })}
        </div>
      </div>

      <div>
        <div className="text-xs font-mono tracking-widest text-muted-foreground uppercase mb-2">
          Extend Trial
        </div>
        <div className="flex flex-wrap gap-2">
          {[7, 14, 30, 90].map((d) => (
            <Button
              key={d}
              variant="outline"
              size="sm"
              disabled={loading === `trial-${d}`}
              onClick={() => extendTrial(d)}
            >
              {loading === `trial-${d}` ? (
                <Loader2 className="mr-2 h-3 w-3 animate-spin" />
              ) : (
                <Calendar className="mr-2 h-3 w-3" />
              )}
              +{d} days
            </Button>
          ))}
        </div>
      </div>

      <div>
        <div className="text-xs font-mono tracking-widest text-muted-foreground uppercase mb-2">
          Utilities
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" disabled={loading === 'reset'} onClick={resetPeriod}>
            {loading === 'reset' ? (
              <Loader2 className="mr-2 h-3 w-3 animate-spin" />
            ) : (
              <RefreshCw className="mr-2 h-3 w-3" />
            )}
            Reset Billing Period
          </Button>
          <Button variant="outline" size="sm" disabled={loading === 'clear-usage'} onClick={clearUsage}>
            {loading === 'clear-usage' ? (
              <Loader2 className="mr-2 h-3 w-3 animate-spin" />
            ) : (
              <Trash2 className="mr-2 h-3 w-3" />
            )}
            Clear Usage Events
          </Button>
        </div>
      </div>

      {notice && (
        <div className="rounded-md border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-400">
          {notice}
        </div>
      )}
      {error && (
        <div className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive">
          {error}
        </div>
      )}
    </div>
  );
}
