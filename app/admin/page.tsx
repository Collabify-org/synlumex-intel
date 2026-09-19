import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { shortDate, timeAgo } from '@/lib/format';
import { ShieldCheck, Users, CreditCard, History } from 'lucide-react';
import { AdminActions } from './admin-actions';
import { PlanEditor } from './plan-editor';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_super_admin')
    .eq('id', user.id)
    .single();

  if (!profile?.is_super_admin) redirect('/dashboard');

  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('*, plans(*)')
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  const { data: plans } = await supabase
    .from('plans')
    .select('*')
    .order('sort_order');

  const { data: users } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });

  const { data: history } = await supabase
    .from('subscription_history')
    .select('*, profiles(full_name)')
    .order('created_at', { ascending: false })
    .limit(20);

  const { count: projectCount } = await supabase
    .from('projects')
    .select('*', { count: 'exact', head: true });

  const { count: usageCount } = await supabase
    .from('usage_events')
    .select('*', { count: 'exact', head: true });

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <ShieldCheck className="h-6 w-6 text-brand-cyan" /> Admin Panel
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manual control over plans, subscriptions, users, and usage
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4 bg-card/50">
          <div className="text-[10px] font-mono tracking-widest text-muted-foreground uppercase mb-1">
            Projects
          </div>
          <div className="text-2xl font-semibold">{projectCount ?? 0}</div>
        </Card>
        <Card className="p-4 bg-card/50">
          <div className="text-[10px] font-mono tracking-widest text-muted-foreground uppercase mb-1">
            Users
          </div>
          <div className="text-2xl font-semibold">{users?.length ?? 0}</div>
        </Card>
        <Card className="p-4 bg-card/50">
          <div className="text-[10px] font-mono tracking-widest text-muted-foreground uppercase mb-1">
            Usage Events
          </div>
          <div className="text-2xl font-semibold">{usageCount ?? 0}</div>
        </Card>
        <Card className="p-4 bg-card/50">
          <div className="text-[10px] font-mono tracking-widest text-muted-foreground uppercase mb-1">
            Plans
          </div>
          <div className="text-2xl font-semibold">{plans?.length ?? 0}</div>
        </Card>
      </div>

      <Card className="p-5 bg-card/50 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold">Current Subscription</h2>
              <Badge
                variant={subscription?.status === 'active' ? 'green' : 'amber'}
                className="capitalize"
              >
                {subscription?.status}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Plan:{' '}
              <span className="text-foreground font-mono">
                {(subscription as any)?.plans?.name}
              </span>{' '}
              · Period ends {shortDate((subscription as any)?.current_period_end)} ·
              Trial ends {shortDate((subscription as any)?.trial_ends_at)}
            </p>
          </div>
        </div>

        <AdminActions
          subscriptionId={subscription?.id ?? ''}
          currentPlanId={(subscription as any)?.plan_id ?? ''}
          plans={(plans ?? []).map((p) => ({ id: p.id, name: p.name }))}
        />
      </Card>

      <Card className="p-5 bg-card/50 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <CreditCard className="h-4 w-4 text-brand-cyan" />
          <h2 className="text-lg font-semibold">Plans</h2>
        </div>
        <PlanEditor plans={plans ?? []} />
      </Card>

      <Card className="bg-card/50 overflow-hidden mb-6">
        <div className="p-4 border-b border-border flex items-center gap-2">
          <Users className="h-4 w-4 text-brand-cyan" />
          <h2 className="text-lg font-semibold">Users</h2>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-muted/30">
            <tr className="text-[10px] font-mono tracking-widest text-muted-foreground">
              <th className="text-left p-3 font-normal">NAME</th>
              <th className="text-left p-3 font-normal">EMAIL</th>
              <th className="text-left p-3 font-normal">ROLE</th>
              <th className="text-left p-3 font-normal">SUPER ADMIN</th>
              <th className="text-right p-3 font-normal">JOINED</th>
            </tr>
          </thead>
          <tbody>
            {(users ?? []).map((u) => (
              <tr key={u.id} className="border-t border-border">
                <td className="p-3">{u.full_name}</td>
                <td className="p-3 font-mono text-xs text-muted-foreground">{u.email}</td>
                <td className="p-3">
                  <Badge
                    variant={u.role === 'owner' ? 'green' : 'secondary'}
                    className="capitalize text-[10px]"
                  >
                    {u.role}
                  </Badge>
                </td>
                <td className="p-3">
                  {u.is_super_admin ? (
                    <Badge variant="red" className="text-[10px]">
                      SUPER ADMIN
                    </Badge>
                  ) : (
                    <span className="text-xs text-muted-foreground">—</span>
                  )}
                </td>
                <td className="p-3 text-right text-xs text-muted-foreground font-mono">
                  {shortDate(u.created_at)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <Card className="bg-card/50 overflow-hidden">
        <div className="p-4 border-b border-border flex items-center gap-2">
          <History className="h-4 w-4 text-brand-cyan" />
          <h2 className="text-lg font-semibold">Subscription Change History</h2>
        </div>
        {(history ?? []).length === 0 ? (
          <div className="p-8 text-center text-xs text-muted-foreground">
            No changes yet.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-muted/30">
              <tr className="text-[10px] font-mono tracking-widest text-muted-foreground">
                <th className="text-left p-3 font-normal">WHEN</th>
                <th className="text-left p-3 font-normal">FROM</th>
                <th className="text-left p-3 font-normal">TO</th>
                <th className="text-left p-3 font-normal">BY</th>
                <th className="text-left p-3 font-normal">REASON</th>
              </tr>
            </thead>
            <tbody>
              {(history ?? []).map((h: any) => (
                <tr key={h.id} className="border-t border-border">
                  <td className="p-3 text-xs font-mono text-muted-foreground">
                    {timeAgo(h.created_at)}
                  </td>
                  <td className="p-3 text-xs font-mono">{h.old_plan_id ?? '—'}</td>
                  <td className="p-3 text-xs font-mono text-brand-cyan">
                    {h.new_plan_id}
                  </td>
                  <td className="p-3 text-xs">
                    {(h.profiles as any)?.full_name ?? 'system'}
                  </td>
                  <td className="p-3 text-xs text-muted-foreground">
                    {h.reason ?? '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  );
}
