import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { shortDate, timeAgo } from '@/lib/format';
import {
  ArrowLeft, Building2, Users, FolderKanban, Zap, ShieldCheck,
  LogOut, CreditCard
} from 'lucide-react';
import { OrgActions } from './org-actions';
import { OrgUsers } from './org-users';
import { PlanEditor } from './plan-editor';
import { AddUser } from './add-user';
import { ImpersonateButton } from './impersonate-button';
import { BillingPanel } from './billing-panel';

export const dynamic = 'force-dynamic';

export default async function OrgDetailPage({ params }: { params: { id: string } }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/admin/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (!profile?.is_super_admin) {
    await supabase.auth.signOut();
    redirect('/admin/login');
  }

  const { data: org } = await supabase
    .from('organizations')
    .select('*')
    .eq('id', params.id)
    .single();

  if (!org) notFound();

  const { data: plan } = await supabase
    .from('plans')
    .select('*')
    .eq('id', org.plan_id)
    .single();

  const { data: allPlans } = await supabase
    .from('plans')
    .select('*')
    .order('sort_order');

  const { count: projectCount } = await supabase
    .from('projects')
    .select('*', { count: 'exact', head: true })
    .eq('organization_id', org.id);

  const { count: usageCount } = await supabase
    .from('usage_events')
    .select('*', { count: 'exact', head: true })
    .eq('organization_id', org.id);

  const { data: members } = await supabase
    .from('organization_members')
    .select('id, role, joined_at, user_id, profiles(id, email, full_name)')
    .eq('organization_id', org.id)
    .order('joined_at', { ascending: true });

    const { data: history } = await supabase
    .from('subscription_history')
    .select('*, profiles(full_name)')
    .order('created_at', { ascending: false })
    .limit(10);

  const { data: invoices } = await supabase
    .from('invoices')
    .select('*')
    .eq('organization_id', org.id)
    .order('created_at', { ascending: false });

  const { data: payments } = await supabase
    .from('payments')
    .select('*')
    .eq('organization_id', org.id)
    .order('received_at', { ascending: false });

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
        <div className="ml-auto flex items-center gap-4">
          <span className="text-xs text-muted-foreground font-mono">
            {profile.full_name} · {profile.email}
          </span>
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

      <div className="p-6 max-w-7xl mx-auto">
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="h-3 w-3" /> All Organizations
        </Link>

                {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-lg bg-brand/10 border border-brand/30 flex items-center justify-center">
              <Building2 className="h-6 w-6 text-brand-cyan" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">{org.name}</h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs font-mono text-muted-foreground">{org.slug}</span>
                <Badge
                  variant={
                    org.status === 'active'
                      ? 'green'
                      : org.status === 'trialing'
                        ? 'amber'
                        : 'secondary'
                  }
                  className="capitalize text-[10px]"
                >
                  {org.status}
                </Badge>
              </div>
            </div>
          </div>
          <ImpersonateButton orgId={org.id} />
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="p-4 bg-card/50">
            <div className="flex items-center gap-2 text-[10px] font-mono tracking-widest text-muted-foreground uppercase mb-1">
              <FolderKanban className="h-3 w-3" /> Projects
            </div>
            <div className="text-2xl font-semibold">{projectCount ?? 0}</div>
          </Card>
          <Card className="p-4 bg-card/50">
            <div className="flex items-center gap-2 text-[10px] font-mono tracking-widest text-muted-foreground uppercase mb-1">
              <Users className="h-3 w-3" /> Users
            </div>
            <div className="text-2xl font-semibold">{members?.length ?? 0}</div>
          </Card>
          <Card className="p-4 bg-card/50">
            <div className="flex items-center gap-2 text-[10px] font-mono tracking-widest text-muted-foreground uppercase mb-1">
              <Zap className="h-3 w-3" /> AI Usage
            </div>
            <div className="text-2xl font-semibold">{usageCount ?? 0}</div>
          </Card>
          <Card className="p-4 bg-card/50">
            <div className="text-[10px] font-mono tracking-widest text-muted-foreground uppercase mb-1">
              Current Plan
            </div>
            <div className="text-2xl font-semibold capitalize">
              {plan?.name ?? org.plan_id ?? '—'}
            </div>
          </Card>
        </div>

        {/* Plan Details */}
        <Card className="p-5 bg-card/50 mb-6">
          <h2 className="text-lg font-semibold mb-4">Plan Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <div className="text-xs text-muted-foreground">Current Plan</div>
              <div className="font-medium mt-1">{plan?.name ?? '—'}</div>
              {plan && (
                <div className="text-xs text-muted-foreground font-mono mt-0.5">
                  ₹{plan.price_monthly?.toLocaleString('en-IN') ?? '—'} / month
                </div>
              )}
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Period Ends</div>
              <div className="font-medium mt-1">{shortDate(org.current_period_end)}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Trial Ends</div>
              <div className="font-medium mt-1">
                {org.trial_ends_at ? shortDate(org.trial_ends_at) : '—'}
              </div>
            </div>
          </div>
        </Card>

        {/* Admin Actions */}
        <Card className="p-5 bg-card/50 mb-6">
          <h2 className="text-lg font-semibold mb-4">Admin Actions</h2>
          <OrgActions orgId={org.id} currentPlanId={org.plan_id ?? ''} />
        </Card>

        {/* Billing */}
        <BillingPanel
          orgId={org.id}
          orgName={org.name}
          plan={plan ? { id: plan.id, name: plan.name, price_monthly: plan.price_monthly } : null}
          invoices={invoices ?? []}
          payments={payments ?? []}
        />

        {/* Plan Editor */}
        <Card className="p-5 bg-card/50 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <CreditCard className="h-4 w-4 text-brand-cyan" />
            <h2 className="text-lg font-semibold">Manage Plans</h2>
          </div>
          <p className="text-xs text-muted-foreground mb-4">
            Edit pricing tiers and limits. These apply globally to all organizations.
          </p>
          <PlanEditor plans={allPlans ?? []} />
        </Card>

        {/* Users */}
        <Card className="bg-card/50 overflow-hidden mb-6">
          <div className="p-4 border-b border-border flex items-center gap-2">
            <Users className="h-4 w-4 text-brand-cyan" />
            <h2 className="text-lg font-semibold">Users in this Organization</h2>
          </div>
          <AddUser orgId={org.id} />
          <OrgUsers members={(members ?? []) as any} />
        </Card>

        {/* Change history */}
        <Card className="bg-card/50 overflow-hidden">
          <div className="p-4 border-b border-border">
            <h2 className="text-lg font-semibold">Recent Subscription Changes</h2>
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
                </tr>
              </thead>
              <tbody>
                {(history ?? []).map((h: any) => (
                  <tr key={h.id} className="border-t border-border">
                    <td className="p-3 text-xs font-mono text-muted-foreground">
                      {timeAgo(h.created_at)}
                    </td>
                    <td className="p-3 text-xs font-mono">{h.old_plan_id ?? '—'}</td>
                    <td className="p-3 text-xs font-mono text-brand-cyan">{h.new_plan_id}</td>
                    <td className="p-3 text-xs">
                      {(h.profiles as any)?.full_name ?? 'system'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Card>
      </div>
    </div>
  );
}
