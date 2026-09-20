import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import {
  trialEndingEmail,
  projectRedEmail,
  inactiveEmail,
  weeklyDigestEmail
} from '@/lib/email/templates';

export const runtime = 'nodejs';
export const maxDuration = 60;

const FROM = 'SYNLUMEX INTEL <onboarding@resend.dev>';
const DAY = 86400000;

export async function GET(req: Request) {
  // Verify cron secret (Vercel sets Authorization: Bearer <CRON_SECRET>)
  const authHeader = req.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) return NextResponse.json({ error: 'RESEND_API_KEY not set' }, { status: 500 });

  const resend = new Resend(resendKey);
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );

  const now = new Date();
  const today = now.toISOString().slice(0, 10);
  const sent: any[] = [];
  const errors: any[] = [];

  async function sendOnce({
    orgId,
    email,
    type,
    subject,
    html,
    dedupeKey
  }: {
    orgId: string;
    email: string;
    type: string;
    subject: string;
    html: string;
    dedupeKey: string;
  }) {
    // Skip if already sent today with this dedupe key
    const { data: existing } = await supabase
      .from('notifications_sent')
      .select('id')
      .eq('dedupe_key', dedupeKey)
      .maybeSingle();
    if (existing) return;

    try {
      const result = await resend.emails.send({
        from: FROM,
        to: email,
        subject,
        html
      });
      await supabase.from('notifications_sent').insert({
        org_id: orgId,
        recipient_email: email,
        notification_type: type,
        subject,
        dedupe_key: dedupeKey,
        resend_message_id: (result as any)?.data?.id ?? null
      });
      sent.push({ orgId, email, type });
    } catch (e: any) {
      await supabase.from('notifications_sent').insert({
        org_id: orgId,
        recipient_email: email,
        notification_type: type,
        subject,
        dedupe_key: dedupeKey,
        error: e?.message ?? 'unknown'
      });
      errors.push({ orgId, email, type, error: e?.message });
    }
  }

  // ---------- 1. Trial ending in <= 3 days ----------
  const in3Days = new Date(now.getTime() + 3 * DAY).toISOString();
  const { data: trialsEnding } = await supabase
    .from('organizations')
    .select('id, name, plan_id, trial_ends_at')
    .eq('status', 'trialing')
    .not('trial_ends_at', 'is', null)
    .lte('trial_ends_at', in3Days)
    .gte('trial_ends_at', now.toISOString());

  for (const org of trialsEnding ?? []) {
    const daysLeft = Math.max(
      Math.ceil((new Date(org.trial_ends_at!).getTime() - now.getTime()) / DAY),
      0
    );

    // Find org owners
    const { data: owners } = await supabase
      .from('organization_members')
      .select('user_id, profiles(email, full_name)')
      .eq('organization_id', org.id)
      .eq('role', 'owner');

    for (const o of owners ?? []) {
      const email = (o.profiles as any)?.email;
      if (!email) continue;
      await sendOnce({
        orgId: org.id,
        email,
        type: 'trial_ending',
        subject: `Your SYNLUMEX trial ends in ${daysLeft} day${daysLeft === 1 ? '' : 's'}`,
        html: trialEndingEmail({
          orgName: org.name,
          daysLeft,
          planName: org.plan_id ?? 'Pro'
        }),
        dedupeKey: `trial_ending:${org.id}:${today}`
      });
    }
  }

  // ---------- 2. Red projects ----------
  const { data: redProjects } = await supabase
    .from('projects')
    .select('id, code, name, health, organization_id, owner_id')
    .eq('health', 'red')
    .eq('archived', false);

  for (const p of redProjects ?? []) {
    // Find the owner of the project
    let email: string | null = null;
    let orgName = '';

    if (p.owner_id) {
      const { data: prof } = await supabase
        .from('profiles')
        .select('email')
        .eq('id', p.owner_id)
        .single();
      email = prof?.email ?? null;
    }

    if (p.organization_id) {
      const { data: org } = await supabase
        .from('organizations')
        .select('name')
        .eq('id', p.organization_id)
        .single();
      orgName = org?.name ?? '';

      // Fallback: notify org owners if project has no owner
      if (!email) {
        const { data: owners } = await supabase
          .from('organization_members')
          .select('user_id, profiles(email)')
          .eq('organization_id', p.organization_id)
          .eq('role', 'owner');
        email = (owners?.[0]?.profiles as any)?.email ?? null;
      }
    }

    if (!email) continue;

    await sendOnce({
      orgId: p.organization_id,
      email,
      type: 'project_red',
      subject: `Project alert: ${p.code} is CRITICAL`,
      html: projectRedEmail({
        orgName,
        projectCode: p.code,
        projectName: p.name,
        health: p.health
      }),
      dedupeKey: `project_red:${p.id}:${today}`
    });
  }

  // ---------- 3. Inactive users (no login in 7+ days) ----------
  const sevenDaysAgo = new Date(now.getTime() - 7 * DAY).toISOString();
  const { data: inactiveProfiles } = await supabase
    .from('profiles')
    .select('id, email, full_name, last_login_at, impersonating_org_id')
    .not('last_login_at', 'is', null)
    .lt('last_login_at', sevenDaysAgo)
    .is('is_super_admin', false)
    .is('impersonating_org_id', null);

  for (const p of inactiveProfiles ?? []) {
    // Find their org
    const { data: membership } = await supabase
      .from('organization_members')
      .select('organization_id, organizations(name)')
      .eq('user_id', p.id)
      .limit(1)
      .maybeSingle();

    if (!membership) continue;
    const orgName = (membership.organizations as any)?.name ?? 'your workspace';
    const days = Math.floor((now.getTime() - new Date(p.last_login_at!).getTime()) / DAY);

    await sendOnce({
      orgId: membership.organization_id,
      email: p.email,
      type: 'inactive',
      subject: `We miss you — ${days} days since last login`,
      html: inactiveEmail({ orgName, days }),
      dedupeKey: `inactive:${p.id}:${today}`
    });
  }

  // ---------- 4. Weekly digest (Mondays only) ----------
  const isMonday = now.getUTCDay() === 1;
  if (isMonday) {
    const { data: orgs } = await supabase
      .from('organizations')
      .select('id, name')
      .eq('status', 'active');

    for (const org of orgs ?? []) {
      const { count: projectCount } = await supabase
        .from('projects')
        .select('*', { count: 'exact', head: true })
        .eq('organization_id', org.id)
        .eq('archived', false);

      const { count: criticalCount } = await supabase
        .from('projects')
        .select('*', { count: 'exact', head: true })
        .eq('organization_id', org.id)
        .eq('health', 'red');

      const { count: openExceptions } = await supabase
        .from('exceptions')
        .select('*', { count: 'exact', head: true })
        .eq('organization_id', org.id)
        .eq('status', 'open');

      const { data: billing } = await supabase
        .from('billing')
        .select('amount')
        .eq('organization_id', org.id);

      const { data: collections } = await supabase
        .from('collections')
        .select('amount')
        .eq('organization_id', org.id);

      const billed = (billing ?? []).reduce((s, b) => s + Number(b.amount), 0);
      const collected = (collections ?? []).reduce((s, c) => s + Number(c.amount), 0);
      const unbilled = Math.max(billed - collected, 0);
      const unbilledStr =
        unbilled >= 10000000
          ? `₹${(unbilled / 10000000).toFixed(2)} Cr`
          : `₹${(unbilled / 100000).toFixed(2)} L`;

      const { data: owners } = await supabase
        .from('organization_members')
        .select('user_id, profiles(email)')
        .eq('organization_id', org.id)
        .eq('role', 'owner');

      for (const o of owners ?? []) {
        const email = (o.profiles as any)?.email;
        if (!email) continue;

        await sendOnce({
          orgId: org.id,
          email,
          type: 'weekly_digest',
          subject: `Weekly digest — ${org.name}`,
          html: weeklyDigestEmail({
            orgName: org.name,
            projectCount: projectCount ?? 0,
            criticalCount: criticalCount ?? 0,
            openExceptions: openExceptions ?? 0,
            unbilledRevenue: unbilledStr
          }),
          dedupeKey: `weekly_digest:${org.id}:${today}`
        });
      }
    }
  }

  return NextResponse.json({
    ok: true,
    sent: sent.length,
    errors: errors.length,
    details: { sent, errors }
  });
}
