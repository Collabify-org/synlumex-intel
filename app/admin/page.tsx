import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { shortDate } from '@/lib/format';
import { ShieldCheck, Building2, Users, CreditCard, Crown, LogOut } from 'lucide-react';
import { Logo } from '@/components/brand/logo';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
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

  // Fetch all organizations with counts
  const { data: orgs } = await supabase
    .from('organizations')
    .select(`
      id, name, slug, plan_id, status, trial_ends_at, current_period_end, created_at
    `)
    .order('created_at', { ascending: false });

  // For each org, fetch member count, project count, usage count
  const orgsWithStats = await Promise.all(
    (orgs ?? []).map(async (org) => {
      const { count: memberCount } = await supabase
        .from('organization_members')
        .select('*', { count: 'exact', head: true })
        .eq('organization_id', org.id);

      const { count: projectCount } = await supabase
        .from('projects')
        .select('*', { count: 'exact', head: true })
        .eq('organization_id', org.id);

      const { count: usageCount } = await supabase
        .from('usage_events')
        .select('*', { count: 'exact', head: true })
        .eq('organization_id', org.id);

      // Fetch plan details
      const { data: plan } = await supabase
        .from('plans')
        .select('name, price_monthly, max_projects, max_users, max_ai_extractions_monthly')
        .eq('id', org.plan_id)
        .single();

      return {
        ...org,
        memberCount: memberCount ?? 0,
        projectCount: projectCount ?? 0,
        usageCount: usageCount ?? 0,
        plan
      };
    })
  );

  const totalOrgs = orgsWithStats.length;
  const totalUsers = orgsWithStats.reduce((sum, o) => sum + o.memberCount, 0);
  const totalProjects = orgsWithStats.reduce((sum, o) => sum + o.projectCount, 0);
  const trialingCount = orgsWithStats.filter((o) => o.status === 'trialing').length;

  return (
    <div className="min-h-screen bg-background">
      {/* Sticky admin topbar */}
      <header className="sticky top-0 z-40 h-14 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 flex items-center px-6">
        <div className="flex items-center gap-3">
          <Logo size={28} interactive />
          <div className="text-xs font-mono tracking-widest text-muted-foreground uppercase">
            Admin
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
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              <Crown className="h-6 w-6 text-brand-cyan" /> Organizations
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              All client workspaces on the platform. Click into any org to manage plans and usage.
            </p>
          </div>
          <Link
            href="/admin/orgs/new"
            className="inline-flex items-center gap-2 rounded-md brand-gradient text-white px-3 py-2 text-sm font-medium hover:opacity-90"
          >
            <Building2 className="h-4 w-4" /> New Organization
          </Link>
        </div>

        {/* Global stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="p-4 bg-card/50">
            <div className="text-[10px] font-mono tracking-widest text-muted-foreground uppercase mb-1">
              Total Organizations
            </div>
            <div className="text-2xl font-semibold">{totalOrgs}</div>
          </Card>
          <Card className="p-4 bg-card/50">
            <div className="text-[10px] font-mono tracking-widest text-muted-foreground uppercase mb-1">
              Total Users
            </div>
            <div className="text-2xl font-semibold">{totalUsers}</div>
          </Card>
          <Card className="p-4 bg-card/50">
            <div className="text-[10px] font-mono tracking-widest text-muted-foreground uppercase mb-1">
              Total Projects
            </div>
            <div className="text-2xl font-semibold">{totalProjects}</div>
          </Card>
          <Card className="p-4 bg-card/50">
            <div className="text-[10px] font-mono tracking-widest text-muted-foreground uppercase mb-1">
              On Trial
            </div>
            <div className="text-2xl font-semibold text-brand-cyan">{trialingCount}</div>
          </Card>
        </div>

        {/* Orgs table */}
        <Card className="bg-card/50 overflow-hidden">
          <div className="p-4 border-b border-border flex items-center gap-2">
            <Building2 className="h-4 w-4 text-brand-cyan" />
            <h2 className="text-lg font-semibold">Client Workspaces</h2>
          </div>

          {orgsWithStats.length === 0 ? (
            <div className="p-12 text-center text-sm text-muted-foreground">
              No organizations yet. Create one to get started.
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-muted/30">
                <tr className="text-[10px] font-mono tracking-widest text-muted-foreground">
                  <th className="text-left p-3 font-normal">ORGANIZATION</th>
                  <th className="text-left p-3 font-normal">PLAN</th>
                  <th className="text-left p-3 font-normal">STATUS</th>
                  <th className="text-right p-3 font-normal">USERS</th>
                  <th className="text-right p-3 font-normal">PROJECTS</th>
                  <th className="text-right p-3 font-normal">AI USAGE</th>
                  <th className="text-right p-3 font-normal">CREATED</th>
                  <th className="text-right p-3 font-normal"></th>
                </tr>
              </thead>
              <tbody>
                {orgsWithStats.map((org) => (
                  <tr key={org.id} className="border-t border-border hover:bg-accent/30">
                    <td className="p-3">
                      <div className="font-medium">{org.name}</div>
                      <div className="text-[10px] font-mono text-muted-foreground">
                        {org.slug}
                      </div>
                    </td>
                    <td className="p-3">
                      <span className="text-xs font-mono capitalize">
                        {org.plan?.name ?? org.plan_id ?? '—'}
                      </span>
                    </td>
                    <td className="p-3">
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
                    </td>
                    <td className="p-3 text-right font-mono text-xs">{org.memberCount}</td>
                    <td className="p-3 text-right font-mono text-xs">{org.projectCount}</td>
                    <td className="p-3 text-right font-mono text-xs">{org.usageCount}</td>
                    <td className="p-3 text-right text-xs text-muted-foreground font-mono">
                      {shortDate(org.created_at)}
                    </td>
                    <td className="p-3 text-right">
                      <Link
                        href={`/admin/orgs/${org.id}`}
                        className="text-xs text-brand-cyan hover:underline"
                      >
                        Manage →
                      </Link>
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
