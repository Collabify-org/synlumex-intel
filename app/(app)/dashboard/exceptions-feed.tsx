import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle } from 'lucide-react';
import { timeAgo } from '@/lib/format';
import type { ExceptionSeverity } from '@/lib/types';

type Row = {
  id: string;
  project_id: string;
  type: string;
  severity: ExceptionSeverity;
  message: string;
  status: string;
  created_at: string;
  projects: { code: string; name: string } | { code: string; name: string }[] | null;
};

const sevVariant: Record<ExceptionSeverity, 'red' | 'amber' | 'outline' | 'secondary'> = {
  critical: 'red',
  high: 'amber',
  medium: 'outline',
  low: 'secondary'
};

export function ExceptionsFeed({ rows }: { rows: Row[] }) {
  return (
    <Card className="p-5 bg-card/50">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-semibold">Recent Exceptions</h3>
        <Link href="/exceptions" className="text-xs text-brand hover:underline">
          View all →
        </Link>
      </div>
      {rows.length === 0 ? (
        <div className="py-8 text-center text-xs text-muted-foreground">
          No open exceptions. Portfolio is clean.
        </div>
      ) : (
        <div className="space-y-3">
          {rows.map((r) => {
            const proj = Array.isArray(r.projects) ? r.projects[0] : r.projects;
            return (
              <div key={r.id} className="flex items-start gap-3 py-2 border-b border-border last:border-0">
                <div className="h-6 w-6 rounded-md bg-destructive/10 flex items-center justify-center shrink-0 mt-0.5">
                  <AlertTriangle className="h-3 w-3 text-destructive" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-mono text-brand">{proj?.code ?? '—'}</span>
                    <Badge variant={sevVariant[r.severity]} className="text-[9px] px-1.5 py-0">
                      {r.severity}
                    </Badge>
                  </div>
                  <div className="text-sm mt-1 leading-snug">{r.message}</div>
                  <div className="text-[10px] text-muted-foreground font-mono mt-1">
                    {timeAgo(r.created_at)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}
