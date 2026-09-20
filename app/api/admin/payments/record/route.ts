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

    const { orgId, invoiceId, amount, method, reference, receivedAt, notes } = await req.json();

    if (!orgId || !amount) {
      return NextResponse.json({ error: 'orgId and amount required' }, { status: 400 });
    }

    const { data: payment, error } = await supabase
      .from('payments')
      .insert({
        organization_id: orgId,
        invoice_id: invoiceId || null,
        amount: Number(amount),
        method: method || 'bank_transfer',
        reference: reference || null,
        received_at: receivedAt || new Date().toISOString().slice(0, 10),
        notes: notes || null,
        recorded_by: user.id
      })
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    // If payment tied to invoice, update its status
    if (invoiceId) {
      const { data: invoice } = await supabase
        .from('invoices')
        .select('total_amount')
        .eq('id', invoiceId)
        .single();

      const { data: allPayments } = await supabase
        .from('payments')
        .select('amount')
        .eq('invoice_id', invoiceId);

      const totalPaid = (allPayments ?? []).reduce((s, p) => s + Number(p.amount), 0);
      const invoiceTotal = Number(invoice?.total_amount ?? 0);

      let newStatus: 'paid' | 'partial' | 'unpaid' = 'unpaid';
      if (totalPaid >= invoiceTotal - 0.01) newStatus = 'paid';
      else if (totalPaid > 0) newStatus = 'partial';

      await supabase
        .from('invoices')
        .update({
          status: newStatus,
          paid_at: newStatus === 'paid' ? new Date().toISOString() : null,
          updated_at: new Date().toISOString()
        })
        .eq('id', invoiceId);
    }

    return NextResponse.json({ success: true, payment });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? 'Unknown error' }, { status: 500 });
  }
}
