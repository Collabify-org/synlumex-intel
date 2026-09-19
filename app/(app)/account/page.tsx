import { createClient } from '@/lib/supabase/server';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  CreditCard, Check, Sparkles, Users, FolderKanban, Zap, AlertCircle
} from 'lucide-react';
import { formatMoney, shortDate } from '@/lib/format';

export const dynamic = 'force-dynamic';

export default async function AccountPage() {
  const supabase = await createClient();

  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('*, plans(*)')
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  const { data: plans } = await supabase
    .from('plans')
    .select('*')
    .eq('is_active', true)
    .order('sort_order');

  const { count: projectCount } = await supabase
    .from('projects')
    .select('*', { count: 'exact', head: true });

  const { count: userCount } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true });

  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);

  const { count: aiBoqCount } = await supabase
    .from('usage_events')
    .select('*', { count: 'exact', head: true })
    .eq('event_type', 'ai_boq')
    .gte('created_at', monthStart.toISOString());

  const { count: aiRiskCount } = await supabase
    .from('usage_events')
    .select('*', { count: 'exact', head: true })
    .eq('event_type', 'ai_risk')
    .gte('created_at', monthStart.toISOString());

  const plan = (subscription as any)?.plans;
  const status = (subscription as any)?.status ?? 'trialing';
  const trialEnds = (subscription as any)?.trial_ends_at;
  const periodEnd = (subscription as any)?.current_period_end;

  const aiUsed = (aiBoqCount ?? 0) + (aiRiskCount ?? 0);
  const aiLimit = plan?.max_ai_extractions_monthly ?? null;
  const aiPercent = aiLimit ? Math.min((aiUsed / aiLimit) * 100, 100) : 0;

  const projectPercent = plan?.max_projects
    ? Math.min(((projectCount ?? 0) / plan.max_projects) * 100, 100)
    : 0;

  const userPercent = plan?.max_users
    ? Math.min(((userCount ?? 0) / plan.max_users) * 100, 100)
    : 0;

  const trialDaysLeft = trialEnds
    ? Math.max(Math.ceil((new Date(trialEnds).getTime() - Date.now()) / 86400000), 0)
    : 0;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <CreditCard className="h-6 w-6 text-brand-cyan" /> Account
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Your subscription, usage, and billing
        </p>
      </div>

      {status === 'trialing' && trialDaysLeft > 0 && (
        <Card className="p-4 bg-brand-cyan/5 border-brand-cyan/30 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sparkles className="h-5 w-5 text-brand-cyan" />
              <div>
                <div className="text-sm font-semibold">
                  You&apos;re on a Pro trial · {trialDaysLeft} day{trialDaysLeft === 1 ? '' : 's'} left
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  Trial ends {shortDate(trialEnds)}. Upgrade anytime to keep Pro features.
                </div>
              </div>
            </div>
            <Button className="brand-gradient">
              Upgrade Now
            </Button>
          </div>
        </Card>
      )}

      <Card className="p-5 bg-card/50 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold">{plan?.name ?? '—'} Plan</h2>
              <Badge variant={status === 'active' ? 'green' : 'amber'} className="capitalize">
                {status}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1">{plan?.description}</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-semibold brand-gradient-text">
              {formatMoney(Number(plan?.price_monthly ?? 0), 'INR')}
            </div>
            <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
              per month
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <FolderKanban className="h-3.5 w-3.5" />
                Projects
              </div>
              <span className="text-xs font-mono">
                {projectCount ?? 0} / {plan?.max_projects ?? '∞'}
              </span>
            </div>
            {plan?.max_projects && (
              <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full brand-gradient rounded-full transition-all"
                  style={{ width: `${projectPercent}%` }}
                />
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Users className="h-3.5 w-3.5" />
                Team Members
              </div>
              <span className="text-xs font-mono">
                {userCount ?? 0} / {plan?.max_users ?? '∞'}
              </span>
            </div>
            {plan?.max_users && (
              <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full brand-gradient rounded-full transition-all"
                  style={{ width: `${userPercent}%` }}
                />
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Zap className="h-3.5 w-3.5" />
                AI Extractions (this month)
              </div>
              <span className="text-xs font-mono">
                {aiUsed} / {aiLimit ?? '∞'}
              </span>
            </div>
            {aiLimit && (
              <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    aiPercent > 80 ? 'bg-amber-500' : 'brand-gradient'
                  }`}
                  style={{ width: `${aiPercent}%` }}
                />
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between mt-6 pt-4 border-t border-border text-xs">
          <span className="text-muted-foreground">
            Current period ends{' '}
            <span className="text-foreground font-mono">{shortDate(periodEnd)}</span>
          </span>
          <div className="flex gap-2">
            <Button size="sm" variant="outline">Manage Billing</Button>
            <Button size="sm" variant="outline">Cancel</Button>
          </div>
        </div>
      </Card>

      <div className="mb-3">
        <h2 className="text-sm font-semibold">Change Plan</h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          All plans include the AI intelligence layer, historical insights, and audit logs.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {(plans ?? []).map((p) => {
          const current = p.id === plan?.id;
          const features = Array.isArray(p.features) ? p.features : [];
          return (
            <Card
              key={p.id}
              className={`p-5 bg-card/50 relative ${
                current ? 'border-brand-cyan/40 brand-glow' : ''
              }`}
            >
              {current && (
                <div className="absolute top-3 right-3">
                  <Badge variant="green" className="text-[9px]">CURRENT</Badge>
                </div>
              )}
              <h3 className="font-semibold">{p.name}</h3>
              <p className="text-xs text-muted-foreground mt-0.5 mb-4">{p.description}</p>
              <div className="mb-4">
                <span className="text-2xl font-semibold brand-gradient-text">
                  {formatMoney(Number(p.price_monthly), 'INR')}
                </span>
                <span className="text-xs text-muted-foreground ml-1">/ month</span>
              </div>
              <ul className="space-y-2 mb-5">
                {features.map((f: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-xs">
                    <Check className="h-3.5 w-3.5 text-brand-cyan shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Button
                variant={current ? 'outline' : 'default'}
                className={`w-full ${!current ? 'brand-gradient' : ''}`}
                disabled={current}
              >
                {current ? 'Current Plan' : `Switch to ${p.name}`}
              </Button>
            </Card>
          );
        })}
      </div>

      {aiLimit && aiPercent > 80 && (
        <Card className="p-4 border-amber-500/30 bg-amber-500/5 mt-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <div className="text-sm font-medium">
                You&apos;ve used {aiPercent.toFixed(0)}% of your monthly AI quota
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Upgrade to Pro to avoid interruptions. Extractions reset on the 1st of each month.
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
