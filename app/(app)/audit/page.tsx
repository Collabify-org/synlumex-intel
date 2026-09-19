import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { timeAgo } from '@/lib/format';

export const dynamic = 'force-dynamic';

export default async function AuditPage() {
  const supabase = await createClient();
  const { data: logs } = await supabase
    .from('audit_log')
    .select('*, projects(code, name), profiles(full_name)')
    .order('created_at', { ascending: false })
    .limit(100);

  const rows = logs ?? [];

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Audit Log</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Every state change, recompute, and action across the system.
        </p>
      </div>

      <Card className="bg-card/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/30">
              <tr className="text-[10px] font-mono tracking-widest text-muted-foreground">
                <th className="text-left p-3 font-normal">WHEN</th>
                <th className="text-left p-3 font-normal">ACTION</th>
                <th className="text-left p-3 font-normal">PROJECT</th>
                <th className="text-left p-3 font-normal">ACTOR</th>
                <th className="text-left p-3 font-normal">PAYLOAD</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-sm text-muted-foreground">
                    No audit entries yet.
                  </td>
                </tr>
              ) : (
                rows.map((l: any) => {
                  const proj = Array.isArray(l.projects) ? l.projects[0] : l.projects;
                  const profile = Array.isArray(l.profiles) ? l.profiles[0] : l.profiles;
                  return (
                    <tr key={l.id} className="border-t border-border">
                      <td className="p-3 text-xs font-mono text-muted-foreground whitespace-nowrap">
                        {timeAgo(l.created_at)}
                      </td>
                      <td className="p-3">
                        <Badge variant="outline" className="text-[10px] font-mono">
                          {l.action}
                        </Badge>
                      </td>
                      <td className="p-3 font-mono text-xs">
                        {l.project_id ? (
                          <Link href={`/projects/${l.project_id}`} className="text-brand hover:underline">
                            {proj?.code ?? '—'}
                          </Link>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                      <td className="p-3 text-xs text-muted-foreground">
                        {profile?.full_name ?? 'system'}
                      </td>
                      <td className="p-3 text-[10px] font-mono text-muted-foreground truncate max-w-[300px]">
                        {l.payload ? JSON.stringify(l.payload) : '—'}
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
