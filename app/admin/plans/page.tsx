import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Card } from '@/components/ui/card';
import { ShieldCheck, CreditCard, LogOut, ArrowLeft, Building2, Sparkles } from 'lucide-react';
import { PlanEditor } from './plan-editor';

export const dynamic = 'force-dynamic';

export default async function AdminPlansPage() {
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

  const { data: plans } = await supabase
    .from('plans')
    .select('*')
    .order('sort_order');

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

      {/* Admin nav tabs */}
      <div className="border-b border-border bg-card/30">
        <div className="max-w-7xl mx-auto px-6 flex items-center gap-1">
          <Link
            href="/admin"
            className="flex items-center gap-2 px-4 py-3 text-xs font-mono tracking-wider text-muted-foreground hover:text-foreground border-b-2 border-transparent transition-colors"
          >
            <Building2 className="h-3.5 w-3.5" /> ORGANIZATIONS
          </Link>
          <Link
            href="/admin/plans"
            className="flex items-center gap-2 px-4 py-3 text-xs font-mono tracking-wider text-brand-cyan border-b-2 border-brand-cyan transition-colors"
          >
            <CreditCard className="h-3.5 w-3.5" /> PLANS
          </Link>
        </div>
      </div>

      <div className="p-6 max-w-7xl mx-auto">
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="h-3 w-3" /> All Organizations
        </Link>

        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <CreditCard className="h-6 w-6 text-brand-cyan" /> Plans
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Edit the pricing tiers offered to your clients. Changes apply immediately to new signups.
          </p>
        </div>

        <Card className="p-5 bg-card/50">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-4 w-4 text-brand-cyan" />
            <h2 className="text-lg font-semibold">Available Plans</h2>
          </div>
          <PlanEditor plans={plans ?? []} />
        </Card>
      </div>
    </div>
  );
}
