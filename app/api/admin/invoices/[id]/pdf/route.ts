import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';

export async function GET(req: Request, { params }: { params: { id: string } }) {
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

    const { data: invoice } = await supabase
      .from('invoices')
      .select('*, organizations(name, slug)')
      .eq('id', params.id)
      .single();

    if (!invoice) return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });

    const { data: payments } = await supabase
      .from('payments')
      .select('*')
      .eq('invoice_id', invoice.id)
      .order('received_at', { ascending: true });

    const org = invoice.organizations as any;
    const totalPaid = (payments ?? []).reduce((s, p) => s + Number(p.amount), 0);
    const balance = Number(invoice.total_amount) - totalPaid;

    const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<title>Invoice ${invoice.invoice_number}</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif; color: #111; background: #fff; padding: 40px; }
  .container { max-width: 800px; margin: 0 auto; }
  .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px; padding-bottom: 24px; border-bottom: 2px solid #1e40af; }
  .brand { display: flex; align-items: center; gap: 12px; }
  .brand-mark { width: 40px; height: 40px; border-radius: 10px; background: linear-gradient(135deg, #1e40af 0%, #0ea5e9 100%); }
  .brand-text { line-height: 1; }
  .brand-text div:first-child { font-size: 18px; font-weight: 700; color: #111; letter-spacing: -0.5px; }
  .brand-text div:last-child { font-size: 10px; color: #6b7280; letter-spacing: 3px; margin-top: 2px; font-family: ui-monospace, monospace; }
  .inv-meta { text-align: right; }
  .inv-meta div:first-child { font-size: 24px; font-weight: 700; color: #1e40af; }
  .inv-meta div { font-size: 12px; color: #6b7280; margin-top: 4px; }
  .billing { display: flex; justify-content: space-between; margin-bottom: 40px; }
  .billing > div { width: 48%; }
  .label { font-size: 10px; text-transform: uppercase; letter-spacing: 1.5px; color: #6b7280; margin-bottom: 6px; font-family: ui-monospace, monospace; }
  .value { font-size: 14px; color: #111; }
  .value strong { font-weight: 600; }
  table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
  th { text-align: left; font-size: 10px; text-transform: uppercase; letter-spacing: 1.5px; color: #6b7280; font-weight: 500; padding: 10px 0; border-bottom: 1px solid #e5e7eb; font-family: ui-monospace, monospace; }
  th:last-child, td:last-child { text-align: right; }
  td { padding: 14px 0; border-bottom: 1px solid #f3f4f6; font-size: 14px; }
  .totals { width: 320px; margin-left: auto; }
  .totals table { margin-bottom: 0; }
  .totals td { padding: 8px 0; }
  .totals tr:last-child td { border-top: 2px solid #1e40af; border-bottom: none; font-size: 16px; font-weight: 700; color: #1e40af; padding-top: 12px; }
  .paid-stamp { display: inline-block; padding: 6px 14px; border-radius: 4px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin-top: 24px; }
  .paid { background: #dcfce7; color: #166534; }
  .unpaid { background: #fef3c7; color: #92400e; }
  .partial { background: #dbeafe; color: #1e40af; }
  .footer { margin-top: 60px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 10px; color: #9ca3af; text-align: center; font-family: ui-monospace, monospace; letter-spacing: 1px; }
  .notes { font-size: 12px; color: #4b5563; margin-top: 32px; padding: 16px; background: #f9fafb; border-radius: 6px; }
  .print-hint { position: fixed; top: 20px; right: 20px; font-size: 12px; color: #6b7280; }
  @media print { .print-hint { display: none; } body { padding: 0; } }
</style>
</head>
<body>
<div class="print-hint">Press <strong>Ctrl+P</strong> (or Cmd+P) → Save as PDF</div>
<div class="container">
  <div class="header">
    <div class="brand">
      <div class="brand-mark"></div>
      <div class="brand-text">
        <div>SYNLUMEX</div>
        <div>INTEL</div>
      </div>
    </div>
    <div class="inv-meta">
      <div>${invoice.invoice_number}</div>
      <div>Issued ${invoice.issue_date}</div>
      <div>Due ${invoice.due_date}</div>
    </div>
  </div>

  <div class="billing">
    <div>
      <div class="label">From</div>
      <div class="value">
        <strong>SYNLUMEX INTEL</strong><br>
        Owner-side EPC Operating System<br>
        support@synlumex.ai
      </div>
    </div>
    <div>
      <div class="label">Bill To</div>
      <div class="value">
        <strong>${org?.name ?? '—'}</strong><br>
        ${org?.slug ?? ''}
      </div>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th>Description</th>
        <th>Period</th>
        <th>Amount</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>${invoice.plan_name} Plan · Monthly Subscription</td>
        <td>${invoice.period_start ?? '—'} → ${invoice.period_end ?? '—'}</td>
        <td>₹${Number(invoice.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
      </tr>
    </tbody>
  </table>

  <div class="totals">
    <table>
      <tr>
        <td>Subtotal</td>
        <td>₹${Number(invoice.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
      </tr>
      <tr>
        <td>Tax</td>
        <td>₹${Number(invoice.tax_amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
      </tr>
      <tr>
        <td>Total</td>
        <td>₹${Number(invoice.total_amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
      </tr>
    </table>
  </div>

  ${(payments ?? []).length > 0 ? `
    <div style="margin-top: 32px;">
      <div class="label">Payments Received</div>
      <table style="margin-top: 8px;">
        ${(payments ?? []).map((p) => `
          <tr>
            <td>${p.received_at} · ${p.method} ${p.reference ? '· ' + p.reference : ''}</td>
            <td>₹${Number(p.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
          </tr>
        `).join('')}
        <tr>
          <td><strong>Balance Due</strong></td>
          <td><strong>₹${balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong></td>
        </tr>
      </table>
    </div>
  ` : ''}

  <div class="paid-stamp ${
    invoice.status === 'paid' ? 'paid' : invoice.status === 'partial' ? 'partial' : 'unpaid'
  }">
    ${invoice.status === 'paid' ? 'PAID' : invoice.status === 'partial' ? 'PARTIAL' : 'UNPAID'}
  </div>

  ${invoice.notes ? `<div class="notes"><strong>Notes:</strong> ${invoice.notes}</div>` : ''}

  <div class="footer">
    SYNLUMEX INTEL · Owner-side EPC Operating System · Generated ${new Date().toISOString().slice(0, 10)}
  </div>
</div>
</body>
</html>`;

    return new NextResponse(html, {
      headers: { 'Content-Type': 'text/html; charset=utf-8' }
    });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? 'Unknown error' }, { status: 500 });
  }
}
