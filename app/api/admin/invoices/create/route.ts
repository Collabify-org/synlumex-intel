import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    const { data: profile } = await supabase
      .from('profiles')
      .select('is_super_admin')
      .eq('id', user.id)
      .single();

    if (!profile?.is_super_admin) {
      return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
    }

    const { orgId, planId, planName, amount, taxRate, periodStart, periodEnd, notes } = await req.json();

    if (!orgId || !amount) {
      return NextResponse.json({ error: 'orgId and amount required' }, { status: 400 });
    }

    // Generate invoice number
    const { data: numData } = await supabase.rpc('next_invoice_number');
    const invoiceNumber = numData ?? `INV-${Date.now()}`;

    const taxAmount = (Number(amount) * (Number(taxRate) || 0)) / 100;
    const totalAmount = Number(amount) + taxAmount;

    const { data, error } = await supabase
      .from('invoices')
      .insert({
        organization_id: orgId,
        invoice_number: invoiceNumber,
        plan_id: planId || null,
        plan_name: planName || 'Subscription',
        amount: Number(amount),
        tax_amount: taxAmount,
        total_amount: totalAmount,
        period_start: periodStart || null,
        period_end: periodEnd || null,
        notes: notes || null,
        created_by: user.id
      })
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ success: true, invoice: data });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? 'Unknown error' }, { status: 500 });
  }
}
