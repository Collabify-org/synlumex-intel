'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  FileText, Plus, Loader2, X, Check, ExternalLink, IndianRupee
} from 'lucide-react';
import { shortDate } from '@/lib/format';

type Invoice = {
  id: string;
  invoice_number: string;
  plan_name: string;
  amount: number;
  tax_amount: number;
  total_amount: number;
  status: string;
  issue_date: string;
  due_date: string;
  period_start: string | null;
  period_end: string | null;
  paid_at: string | null;
};

type Payment = {
  id: string;
  invoice_id: string | null;
  amount: number;
  method: string;
  reference: string | null;
  received_at: string;
  notes: string | null;
};

type Plan = {
  id: string;
  name: string;
  price_monthly: number;
};

type Props = {
  orgId: string;
  orgName: string;
  plan: Plan | null;
  invoices: Invoice[];
  payments: Payment[];
};

export function BillingPanel({ orgId, orgName, plan, invoices, payments }: Props) {
  const router = useRouter();
  const [mode, setMode] = useState<'idle' | 'invoice' | 'payment'>('idle');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  // Invoice form
  const [amount, setAmount] = useState(plan?.price_monthly ?? 0);
  const [taxRate, setTaxRate] = useState(18);
  const [periodStart, setPeriodStart] = useState(new Date().toISOString().slice(0, 10));
  const [periodEnd, setPeriodEnd] = useState(
    new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10)
  );
  const [notes, setNotes] = useState('');

  // Payment form
  const [payAmount, setPayAmount] = useState(0);
  const [payInvoiceId, setPayInvoiceId] = useState<string>('');
  const [payMethod, setPayMethod] = useState('bank_transfer');
  const [payRef, setPayRef] = useState('');
  const [payDate, setPayDate] = useState(new Date().toISOString().slice(0, 10));

  async function createInvoice() {
    setLoading(true);
    setError(null);
    const res = await fetch('/api/admin/invoices/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orgId,
        planId: plan?.id,
        planName: plan?.name,
        amount,
        taxRate,
        periodStart,
        periodEnd,
        notes
      })
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error);
      return;
    }
    setNotice(`Invoice ${data.invoice.invoice_number} created.`);
    setMode('idle');
    router.refresh();
    setTimeout(() => setNotice(null), 4000);
  }

  async function recordPayment() {
    setLoading(true);
    setError(null);
    const res = await fetch('/api/admin/payments/record', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orgId,
        invoiceId: payInvoiceId || null,
        amount: payAmount,
        method: payMethod,
        reference: payRef,
        receivedAt: payDate
      })
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error);
      return;
    }
    setNotice(`Payment of ₹${payAmount.toLocaleString('en-IN')} recorded.`);
    setMode('idle');
    router.refresh();
    setTimeout(() => setNotice(null), 4000);
  }

  const totalBilled = invoices.reduce((s, i) => s + Number(i.total_amount), 0);
  const totalPaid = payments.reduce((s, p) => s + Number(p.amount), 0);
  const outstanding = Math.max(totalBilled - totalPaid, 0);

  const statusVariant: Record<string, 'green' | 'amber' | 'red' | 'secondary'> = {
    paid: 'green',
    partial: 'amber',
    unpaid: 'red',
    void: 'secondary'
  };

  return (
    <Card className="p-5 bg-card/50 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <IndianRupee className="h-4 w-4 text-brand-cyan" />
          <h2 className="text-lg font-semibold">Billing & Payments</h2>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setMode(mode === 'payment' ? 'idle' : 'payment');
              setPayAmount(0);
              setPayInvoiceId('');
              setError(null);
            }}
          >
            <Plus className="mr-1.5 h-3 w-3" /> Record Payment
          </Button>
          <Button
            size="sm"
            onClick={() => {
              setMode(mode === 'invoice' ? 'idle' : 'invoice');
              setError(null);
            }}
            className="brand-gradient"
          >
            <FileText className="mr-1.5 h-3 w-3" /> New Invoice
          </Button>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="rounded-md border border-border p-3">
          <div className="text-[10px] font-mono tracking-widest text-muted-foreground uppercase mb-1">
            Total Billed
          </div>
          <div className="text-lg font-semibold">
            ₹{totalBilled.toLocaleString('en-IN')}
          </div>
        </div>
        <div className="rounded-md border border-border p-3">
          <div className="text-[10px] font-mono tracking-widest text-muted-foreground uppercase mb-1">
            Total Collected
          </div>
          <div className="text-lg font-semibold text-emerald-400">
            ₹{totalPaid.toLocaleString('en-IN')}
          </div>
        </div>
        <div className="rounded-md border border-border p-3">
          <div className="text-[10px] font-mono tracking-widest text-muted-foreground uppercase mb-1">
            Outstanding
          </div>
          <div className={`text-lg font-semibold ${outstanding > 0 ? 'text-amber-400' : ''}`}>
            ₹{outstanding.toLocaleString('en-IN')}
          </div>
        </div>
      </div>

      {notice && (
        <div className="mb-4 rounded-md border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-400 flex items-center gap-2">
          <Check className="h-3 w-3" /> {notice}
        </div>
      )}
      {error && (
        <div className="mb-4 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive">
          {error}
        </div>
      )}

      {/* New invoice form */}
      {mode === 'invoice' && (
        <div className="mb-5 rounded-md border border-brand-cyan/30 bg-brand/5 p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold">Create Invoice</h3>
            <button onClick={() => setMode('idle')} className="text-muted-foreground hover:text-foreground">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">Amount (₹)</Label>
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
              />
            </div>
            <div>
              <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">Tax Rate (%)</Label>
              <Input
                type="number"
                value={taxRate}
                onChange={(e) => setTaxRate(Number(e.target.value))}
              />
            </div>
            <div>
              <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">Period Start</Label>
              <Input type="date" value={periodStart} onChange={(e) => setPeriodStart(e.target.value)} />
            </div>
            <div>
              <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">Period End</Label>
              <Input type="date" value={periodEnd} onChange={(e) => setPeriodEnd(e.target.value)} />
            </div>
          </div>
          <div className="mb-3">
            <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">Notes (optional)</Label>
            <Input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="e.g. Pro plan renewal" />
          </div>
          <div className="flex items-center justify-between">
            <div className="text-xs text-muted-foreground font-mono">
              Total: ₹{(amount + (amount * taxRate) / 100).toLocaleString('en-IN')}
            </div>
            <Button size="sm" onClick={createInvoice} disabled={loading} className="brand-gradient">
              {loading && <Loader2 className="mr-1.5 h-3 w-3 animate-spin" />}
              Create Invoice
            </Button>
          </div>
        </div>
      )}

      {/* New payment form */}
      {mode === 'payment' && (
        <div className="mb-5 rounded-md border border-brand-cyan/30 bg-brand/5 p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold">Record Payment</h3>
            <button onClick={() => setMode('idle')} className="text-muted-foreground hover:text-foreground">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">Amount (₹)</Label>
              <Input
                type="number"
                value={payAmount}
                onChange={(e) => setPayAmount(Number(e.target.value))}
              />
            </div>
            <div>
              <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">Method</Label>
              <select
                value={payMethod}
                onChange={(e) => setPayMethod(e.target.value)}
                className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="bank_transfer">Bank Transfer</option>
                <option value="upi">UPI</option>
                <option value="wire">Wire</option>
                <option value="cash">Cash</option>
                <option value="card">Card</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">Reference (optional)</Label>
              <Input
                value={payRef}
                onChange={(e) => setPayRef(e.target.value)}
                placeholder="NEFT/UTR number"
              />
            </div>
            <div>
              <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">Received On</Label>
              <Input type="date" value={payDate} onChange={(e) => setPayDate(e.target.value)} />
            </div>
          </div>
          <div className="mb-3">
            <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">Apply to Invoice (optional)</Label>
            <select
              value={payInvoiceId}
              onChange={(e) => setPayInvoiceId(e.target.value)}
              className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="">— Unallocated —</option>
              {invoices.filter((i) => i.status !== 'paid').map((i) => (
                <option key={i.id} value={i.id}>
                  {i.invoice_number} · ₹{Number(i.total_amount).toLocaleString('en-IN')}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end">
            <Button size="sm" onClick={recordPayment} disabled={loading} className="brand-gradient">
              {loading && <Loader2 className="mr-1.5 h-3 w-3 animate-spin" />}
              Save Payment
            </Button>
          </div>
        </div>
      )}

      {/* Invoices table */}
      {invoices.length > 0 ? (
        <div className="overflow-hidden rounded-md border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted/30">
              <tr className="text-[10px] font-mono tracking-widest text-muted-foreground">
                <th className="text-left p-3 font-normal">INVOICE</th>
                <th className="text-left p-3 font-normal">PLAN</th>
                <th className="text-right p-3 font-normal">AMOUNT</th>
                <th className="text-right p-3 font-normal">DUE</th>
                <th className="text-left p-3 font-normal">STATUS</th>
                <th className="text-right p-3 font-normal"></th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr key={inv.id} className="border-t border-border">
                  <td className="p-3 font-mono text-xs text-brand-cyan">{inv.invoice_number}</td>
                  <td className="p-3 text-xs">{inv.plan_name}</td>
                  <td className="p-3 text-right font-mono text-xs">
                    ₹{Number(inv.total_amount).toLocaleString('en-IN')}
                  </td>
                  <td className="p-3 text-right text-xs text-muted-foreground font-mono">
                    {shortDate(inv.due_date)}
                  </td>
                  <td className="p-3">
                    <Badge variant={statusVariant[inv.status] ?? 'secondary'} className="capitalize text-[10px]">
                      {inv.status}
                    </Badge>
                  </td>
                  <td className="p-3 text-right">
                    <a
                      href={`/api/admin/invoices/${inv.id}/pdf`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-brand-cyan hover:underline inline-flex items-center gap-1"
                    >
                      <ExternalLink className="h-3 w-3" /> View
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="rounded-md border border-dashed border-border p-8 text-center text-xs text-muted-foreground">
          No invoices yet. Click "New Invoice" to create one.
        </div>
      )}

      {/* Payments log */}
      {payments.length > 0 && (
        <div className="mt-5">
          <div className="text-[10px] font-mono tracking-widest text-muted-foreground uppercase mb-2">
            Payment History
          </div>
          <div className="overflow-hidden rounded-md border border-border">
            <table className="w-full text-sm">
              <tbody>
                {payments.map((p) => (
                  <tr key={p.id} className="border-t border-border first:border-t-0">
                    <td className="p-3 text-xs font-mono text-muted-foreground">
                      {shortDate(p.received_at)}
                    </td>
                    <td className="p-3 text-xs capitalize">{p.method.replace('_', ' ')}</td>
                    <td className="p-3 text-xs text-muted-foreground font-mono">{p.reference ?? '—'}</td>
                    <td className="p-3 text-right font-mono text-xs text-emerald-400">
                      +₹{Number(p.amount).toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </Card>
  );
}
