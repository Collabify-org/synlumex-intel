import { Card } from '@/components/ui/card';
import { Bell, AlertTriangle } from 'lucide-react';
import { shortDate } from '@/lib/format';

type Row = {
  id: string;
  project_id: string;
  message: string;
  due_at: string;
  status: string;
  projects: { code: string } | { code: string }[] | null;
};

export function RemindersPanel({ rows }: { rows: Row[] }) {
  const now = new Date();
  const overdueCount = rows.filter((r) => new Date(r.due_at) < now).length;

  return (
    <Card className="p-5 bg-card/50">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-semibold">Today&apos;s Reminders</h3>
        {overdueCount > 0 && (
          <span className="text-[10px] font-mono text-destructive">
            {overdueCount} overdue
          </span>
        )}
      </div>
      {rows.length === 0 ? (
        <div className="py-8 text-center text-xs text-muted-foreground">
          Nothing pending today.
        </div>
      ) : (
        <div className="space-y-2">
          {rows.map((r) => {
            const proj = Array.isArray(r.projects) ? r.projects[0] : r.projects;
            const overdue = new Date(r.due_at) < now;
            return (
              <div
                key={r.id}
                className="flex items-start gap-3 rounded-md border border-border/50 p-3 bg-background/30"
              >
                <div
                  className={`h-6 w-6 rounded flex items-center justify-center shrink-0 mt-0.5 ${
                    overdue ? 'bg-destructive/10 text-destructive' : 'bg-brand/10 text-brand'
                  }`}
                >
                  {overdue ? <AlertTriangle className="h-3 w-3" /> : <Bell className="h-3 w-3" />}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm leading-snug">{r.message}</div>
                  <div className="text-[10px] text-muted-foreground font-mono mt-1">
                    {proj?.code ?? '—'} · {shortDate(r.due_at)}
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
