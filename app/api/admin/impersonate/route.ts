import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    const { data: callerProfile } = await supabase
      .from('profiles')
      .select('is_super_admin')
      .eq('id', user.id)
      .single();

    if (!callerProfile?.is_super_admin) {
      return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
    }

    const { orgId, action } = await req.json();

    if (action === 'start') {
      if (!orgId) return NextResponse.json({ error: 'orgId required' }, { status: 400 });

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ impersonating_org_id: orgId })
        .eq('id', user.id);

      if (updateError) throw updateError;

      await supabase.from('impersonation_log').insert({
        admin_id: user.id,
        org_id: orgId,
        action: 'start'
      });

      return NextResponse.json({ success: true, impersonating: orgId });
    }

    if (action === 'stop') {
      // Log stop for the current org (if any)
      const { data: me } = await supabase
        .from('profiles')
        .select('impersonating_org_id')
        .eq('id', user.id)
        .single();

      if (me?.impersonating_org_id) {
        await supabase.from('impersonation_log').insert({
          admin_id: user.id,
          org_id: me.impersonating_org_id,
          action: 'stop'
        });
      }

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ impersonating_org_id: null })
        .eq('id', user.id);

      if (updateError) throw updateError;
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? 'Unknown error' }, { status: 500 });
  }
}
