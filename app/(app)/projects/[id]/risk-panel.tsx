'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Loader2 } from 'lucide-react';

type RiskBullet = {
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  detail: string;
};

const sevVariant: Record<string, 'red' | 'amber' | 'outline' | 'secondary'> = {
  critical: 'red',
  high: 'amber',
  medium: 'outline',
  low: 'secondary'
};

export function RiskPanel({ projectId }: { projectId: string }) {
  const [risks, setRisks] = useState<RiskBullet[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function generate() {
    setLoading(true);
    setError(null);
    setRisks([]);
    try {
      const res = await fetch('/api/ai/risk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Risk generation failed');
      setRisks(data.risks ?? []);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="p-5 bg-card/50">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-brand" />
          <h3 className="font-semibold">AI Risk Analysis</h3>
        </div>
        <Button size="sm" variant="outline" onClick={generate} disabled={loading}>
          {loading && <Loader2 className="mr-2 h-3 w-3 animate-spin" />}
          {risks.length === 0 ? 'Generate' : 'Regenerate'}
        </Button>
      </div>

      {error && (
        <div className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive">
          {error}
        </div>
      )}

      {risks.length === 0 && !loading && !error && (
        <p className="text-xs text-muted-foreground">
          Click Generate to analyze this project and surface risks.
        </p>
      )}

      {risks.length > 0 && (
        <div className="space-y-3">
          {risks.map((r, i) => (
            <div key={i} className="border-l-2 pl-3 py-1" style={{
              borderColor: r.severity === 'critical' ? '#ef4444' : r.severity === 'high' ? '#f59e0b' : r.severity === 'medium' ? '#3b82f6' : '#71717a'
            }}>
              <div className="flex items-center gap-2 mb-1">
                <Badge variant={sevVariant[r.severity]} className="text-[9px]">{r.severity}</Badge>
                <span className="text-sm font-medium">{r.title}</span>
              </div>
              <p className="text-xs text-muted-foreground leading-snug">{r.detail}</p>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
