import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { STAGES, type HealthStatus } from '@/lib/types';

type Row = {
  id: string;
  code: string;
  name: string;
  health: HealthStatus;
  current_stage: string;
  currency: string;
  contract_value: number;
  updated_at: string;
};

const healthVariant: Record<HealthStatus, 'green' | 'amber' | 'red' | 'secondary'> = {
  green: 'green',
  amber: 'amber',
  red: 'red',
  on_hold: 'secondary'
};

const healthLabel: Record<HealthStatus, string> = {
  green: 'On Track',
  amber: 'At Risk',
  red: 'Critical',
  on_hold: 'On Hold'
};

export function ProjectsTable({ rows }: { rows: Row[] }) {
  return (
    <Card className="p-5 bg-card/50">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-semibold">Active Projects</h3>
        <Link href="/projects" className="text-xs text-brand hover:underline">
          All →
        </Link>
      </div>
      {rows.length === 0 ? (
        <div className="py-8 text-center text-xs text-muted-foreground">
          No projects yet. Create one from the Projects page.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[10px] font-mono tracking-widest text-muted-foreground border-b border-border">
                <th className="text-left pb-2 font-normal">PROJECT</th>
                <th className="text-left pb-2 font-normal">HEALTH</th>
                <th className="text-left pb-2 font-normal">STAGE</th>
                <th className="text-right pb-2 font-normal">VALUE</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => {
                const stage = STAGES.find((s) => s.key === r.current_stage);
                return (
                  <tr key={r.id} className="border-b border-border/50 last:border-0 hover:bg-accent/30">
                    <td className="py-3 pr-3">
                      <Link href={`/projects/${r.id}`} className="block">
                        <div className="text-xs font-mono text-brand">{r.code}</div>
                        <div className="text-xs text-muted-foreground truncate max-w-[240px]">
                          {r.name}
                        </div>
                      </Link>
                    </td>
                    <td className="py-3 pr-3">
                      <Badge variant={healthVariant[r.health]} className="text-[10px]">
                        {healthLabel[r.health]}
                      </Badge>
                    </td>
                    <td className="py-3 pr-3 text-xs text-muted-foreground">{stage?.label ?? r.current_stage}</td>
                    <td className="py-3 text-right text-xs font-mono text-muted-foreground">
                      {r.currency} {Number(r.contract_value).toLocaleString('en-IN')}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}
