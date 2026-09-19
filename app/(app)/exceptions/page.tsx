import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle } from 'lucide-react';
import { timeAgo } from '@/lib/format';
import type { ExceptionSeverity, ExceptionStatus } from '@/lib/types';

export const dynamic = 'force-dynamic';

const sevVariant: Record<ExceptionSeverity, 'red' | 'amber' | 'outline' | 'secondary'> = {
  critical: 'red', high: 'amber', medium: 'outline', low: 'secondary'
};

export default async function ExceptionsPage() {
  const supabase = await createClient();
  const { data: exceptions } = await supabase
    .from('exceptions')
    .select('*, projects(code, name, currency)')
    .eq('status', 'open')
    .order('severity', { ascending: true })
    .order('created_at', { ascending: false });

  const rows = exceptions ?? [];
  const critical = rows.filter((r) => r.severity === 'critical').length;
  const high = rows.filter((r) => r.severity === 'high').length;
  const medium = rows.filter((r) => r.severity === 'medium').length;
  const low = rows.filter((r) => r.severity === 'low').length;

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Exceptions</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {rows.length} open exception{rows.length === 1 ? '' : 's'} · {critical} critical · {high} high · {medium} medium · {low} low
        </p>
      </div>

      <Card className="bg-card/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/30">
              <tr className="text-[10px] font-mono tracking-widest text-muted-foreground">
                <th className="text-left p-3 font-normal">SEVERITY</th>
                <th className="text-left p-3 font-normal">PROJECT</th>
                <th className="text-left p-3 font-normal">TYPE</th>
                <th className="text-left p-3 font-normal">MESSAGE</th>
                <th className="text-right p-3 font-normal">AGE</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-sm text-muted-foreground">
                    No open exceptions. Portfolio is clean.
                  </td>
                </tr>
              ) : (
                rows.map((e: any) => {
                  const proj = Array.isArray(e.projects) ? e.projects[0] : e.projects;
                  return (
                    <tr key={e.id} className="border-t border-border hover:bg-accent/30">
                      <td className="p-3">
                        <Badge variant={sevVariant[e.severity as ExceptionSeverity]}>
                          {e.severity}
                        </Badge>
                      </td>
                      <td className="p-3 font-mono text-xs">
                        <Link href={`/projects/${e.project_id}`} className="text-brand hover:underline">
                          {proj?.code ?? '—'}
                        </Link>
                        <div className="text-muted-foreground text-[10px] truncate max-w-[220px]">
                          {proj?.name ?? ''}
                        </div>
                      </td>
                      <td className="p-3 text-xs font-mono text-muted-foreground">{e.type}</td>
                      <td className="p-3 text-sm">{e.message}</td>
                      <td className="p-3 text-right text-xs font-mono text-muted-foreground">
                        {timeAgo(e.created_at)}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
