import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bell, AlertTriangle } from 'lucide-react';
import { shortDate } from '@/lib/format';

export const dynamic = 'force-dynamic';

export default async function RemindersPage() {
  const supabase = await createClient();
  const { data: reminders } = await supabase
    .from('reminders')
    .select('*, projects(code, name)')
    .order('due_at', { ascending: true });

  const rows = reminders ?? [];
  const now = new Date();
  const overdue = rows.filter((r) => new Date(r.due_at) < now && r.status === 'pending');
  const upcoming = rows.filter((r) => new Date(r.due_at) >= now && r.status === 'pending');

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Reminders</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {overdue.length} overdue · {upcoming.length} upcoming
        </p>
      </div>

      {overdue.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-semibold mb-3 flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-4 w-4" /> Overdue
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {overdue.map((r: any) => {
              const proj = Array.isArray(r.projects) ? r.projects[0] : r.projects;
              return (
                <Card key={r.id} className="p-4 bg-card/50 border-destructive/30">
                  <div className="text-sm leading-snug mb-2">{r.message}</div>
                  <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground">
                    <Link href={`/projects/${r.project_id}`} className="text-brand hover:underline">
                      {proj?.code}
                    </Link>
                    <span className="text-destructive">{shortDate(r.due_at)}</span>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {upcoming.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <Bell className="h-4 w-4" /> Upcoming
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {upcoming.map((r: any) => {
              const proj = Array.isArray(r.projects) ? r.projects[0] : r.projects;
              return (
                <Card key={r.id} className="p-4 bg-card/50">
                  <div className="text-sm leading-snug mb-2">{r.message}</div>
                  <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground">
                    <Link href={`/projects/${r.project_id}`} className="text-brand hover:underline">
                      {proj?.code}
                    </Link>
                    <span>{shortDate(r.due_at)}</span>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {rows.length === 0 && (
        <Card className="p-12 bg-card/50 text-center text-sm text-muted-foreground">
          No reminders. All clear.
        </Card>
      )}
    </div>
  );
}
