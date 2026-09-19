'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, Loader2, Save } from 'lucide-react';
import { formatMoney } from '@/lib/format';
import type { CurrencyCode } from '@/lib/types';

interface Item {
  description: string;
  unit: string | null;
  quantity: number;
  rate: number;
}

type BoqRow = {
  id: string;
  description: string;
  unit: string | null;
  quantity: number;
  rate: number;
  amount: number;
  source: string;
};

export function BoqTab({
  projectId,
  currency,
  initialItems
}: {
  projectId: string;
  currency: CurrencyCode;
  initialItems: BoqRow[];
}) {
  const router = useRouter();
  const [text, setText] = useState('');
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  async function extract() {
    setLoading(true);
    setError(null);
    setItems([]);
    try {
      const res = await fetch('/api/ai/boq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Extraction failed');
      setItems(data.items ?? []);
      if ((data.items ?? []).length === 0) setError('No items found in the text.');
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function saveAll() {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch('/api/ai/boq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, projectId, save: true })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Save failed');
      setNotice(`Saved ${items.length} items to project.`);
      setText('');
      setItems([]);
      router.refresh();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4">
      <Card className="p-5 bg-card/50">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="h-4 w-4 text-brand" />
          <h3 className="font-semibold">AI BOQ Extraction</h3>
        </div>
        <p className="text-xs text-muted-foreground mb-3">
          Paste a spec, RFQ, or BOQ text. AI extracts structured line items.
        </p>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={5}
          placeholder="e.g. Supply and install 500 cum of M30 grade RCC at Rs 9200 per cum..."
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono"
        />
        <div className="flex items-center gap-2 mt-3">
          <Button onClick={extract} disabled={loading || text.trim().length < 10}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Extract with AI
          </Button>
          {items.length > 0 && (
            <Button onClick={saveAll} variant="secondary" disabled={saving}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Save className="mr-2 h-4 w-4" /> Save {items.length} items
            </Button>
          )}
        </div>
        {error && (
          <div className="mt-3 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive">
            {error}
          </div>
        )}
        {notice && (
          <div className="mt-3 rounded-md border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-400">
            {notice}
          </div>
        )}
      </Card>

      {items.length > 0 && (
        <Card className="bg-card/50 overflow-hidden">
          <div className="p-4 border-b border-border">
            <h4 className="text-sm font-semibold">Extracted Items (preview)</h4>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-muted/30">
              <tr className="text-[10px] font-mono tracking-widest text-muted-foreground">
                <th className="text-left p-3 font-normal">DESCRIPTION</th>
                <th className="text-left p-3 font-normal">UNIT</th>
                <th className="text-right p-3 font-normal">QTY</th>
                <th className="text-right p-3 font-normal">RATE</th>
                <th className="text-right p-3 font-normal">AMOUNT</th>
              </tr>
            </thead>
            <tbody>
              {items.map((it, i) => (
                <tr key={i} className="border-t border-border">
                  <td className="p-3">{it.description}</td>
                  <td className="p-3 text-muted-foreground">{it.unit ?? '—'}</td>
                  <td className="p-3 text-right font-mono text-xs">{it.quantity}</td>
                  <td className="p-3 text-right font-mono text-xs">{it.rate}</td>
                  <td className="p-3 text-right font-mono text-xs">
                    {formatMoney(it.quantity * it.rate, currency)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      <Card className="bg-card/50 overflow-hidden">
        <div className="p-4 border-b border-border">
          <h4 className="text-sm font-semibold">Saved BOQ ({initialItems.length})</h4>
        </div>
        {initialItems.length === 0 ? (
          <div className="p-8 text-center text-xs text-muted-foreground">
            No BOQ items saved yet.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-muted/30">
              <tr className="text-[10px] font-mono tracking-widest text-muted-foreground">
                <th className="text-left p-3 font-normal">DESCRIPTION</th>
                <th className="text-left p-3 font-normal">UNIT</th>
                <th className="text-right p-3 font-normal">QTY</th>
                <th className="text-right p-3 font-normal">RATE</th>
                <th className="text-right p-3 font-normal">AMOUNT</th>
                <th className="text-left p-3 font-normal">SOURCE</th>
              </tr>
            </thead>
            <tbody>
              {initialItems.map((it) => (
                <tr key={it.id} className="border-t border-border">
                  <td className="p-3">{it.description}</td>
                  <td className="p-3 text-muted-foreground">{it.unit ?? '—'}</td>
                  <td className="p-3 text-right font-mono text-xs">{it.quantity}</td>
                  <td className="p-3 text-right font-mono text-xs">{it.rate}</td>
                  <td className="p-3 text-right font-mono text-xs">
                    {formatMoney(Number(it.amount), currency)}
                  </td>
                  <td className="p-3">
                    <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                      it.source === 'ai_extracted'
                        ? 'bg-brand/10 text-brand'
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {it.source}
                    </span>
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
