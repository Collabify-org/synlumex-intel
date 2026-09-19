import { createClient } from '@/lib/supabase/server';

export interface DashboardMetrics {
  totalProjects: number;
  activeProjects: number;
  atRisk: number;
  critical: number;
  onTrack: number;
  onHold: number;
  totalContractValue: number;
  totalBilled: number;
  totalCollected: number;
  totalUnbilled: number;
  totalOverdue: number;
  collectionEfficiency: number;
  openExceptions: number;
  criticalExceptions: number;
  highExceptions: number;
  mediumExceptions: number;
  overdueReminders: number;
  avgExecutionProgress: number;
  stageDistribution: { stage: string; count: number }[];
  currencyBreakdown: { currency: string; value: number }[];
  lastSync: string | null;
}

export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  const supabase = await createClient();

  const { data: projects } = await supabase
    .from('projects')
    .select('*')
    .eq('archived', false);

  const { data: billings } = await supabase.from('billing').select('*');
  const { data: collections } = await supabase.from('collections').select('*');
  const { data: exceptions } = await supabase.from('exceptions').select('*');
  const { data: reminders } = await supabase.from('reminders').select('*');
  const { data: executions } = await supabase
    .from('execution_updates')
    .select('project_id, progress_pct, created_at')
    .order('created_at', { ascending: false });
  const { data: settings } = await supabase.from('settings').select('last_sync_at').single();

  const ps = projects ?? [];
  const bs = billings ?? [];
  const cs = collections ?? [];
  const es = exceptions ?? [];
  const rs = reminders ?? [];
  const xs = executions ?? [];

  const totalContractValue = ps.reduce((s, p) => s + Number(p.contract_value ?? 0), 0);
  const totalBilled = bs.reduce((s, b) => s + Number(b.amount ?? 0), 0);
  const totalCollected = cs.reduce((s, c) => s + Number(c.amount ?? 0), 0);
  const totalOverdue = bs
    .filter((b) => b.status === 'overdue')
    .reduce((s, b) => s + Number(b.amount ?? 0), 0);
  const totalUnbilled = Math.max(totalBilled - totalCollected, 0);

  const openExceptions = es.filter((e) => e.status === 'open').length;
  const criticalExceptions = es.filter((e) => e.status === 'open' && e.severity === 'critical').length;
  const highExceptions = es.filter((e) => e.status === 'open' && e.severity === 'high').length;
  const mediumExceptions = es.filter((e) => e.status === 'open' && e.severity === 'medium').length;

  const overdueReminders = rs.filter(
    (r) => r.status === 'pending' && new Date(r.due_at) < new Date()
  ).length;

  const atRisk = ps.filter((p) => p.health === 'amber').length;
  const critical = ps.filter((p) => p.health === 'red').length;
  const onTrack = ps.filter((p) => p.health === 'green').length;
  const onHold = ps.filter((p) => p.health === 'on_hold').length;

  const executionProjects = ps.filter((p) =>
    ['execution', 'qa_qc', 'testing_commissioning'].includes(p.current_stage)
  );
  const latestByProject = new Map<string, number>();
  for (const x of xs) {
    if (!latestByProject.has(x.project_id)) {
      latestByProject.set(x.project_id, Number(x.progress_pct));
    }
  }
  const avgExecutionProgress =
    executionProjects.length === 0
      ? 0
      : executionProjects.reduce(
          (s, p) => s + (latestByProject.get(p.id) ?? 0),
          0
        ) / executionProjects.length;

  const stageMap = new Map<string, number>();
  for (const p of ps) stageMap.set(p.current_stage, (stageMap.get(p.current_stage) ?? 0) + 1);
  const stageDistribution = Array.from(stageMap.entries()).map(([stage, count]) => ({
    stage,
    count
  }));

  const currencyMap = new Map<string, number>();
  for (const p of ps) {
    currencyMap.set(p.currency, (currencyMap.get(p.currency) ?? 0) + Number(p.contract_value ?? 0));
  }
  const currencyBreakdown = Array.from(currencyMap.entries()).map(([currency, value]) => ({
    currency,
    value
  }));

  return {
    totalProjects: ps.length,
    activeProjects: ps.length,
    atRisk,
    critical,
    onTrack,
    onHold,
    totalContractValue,
    totalBilled,
    totalCollected,
    totalUnbilled,
    totalOverdue,
    collectionEfficiency: totalBilled > 0 ? (totalCollected / totalBilled) * 100 : 0,
    openExceptions,
    criticalExceptions,
    highExceptions,
    mediumExceptions,
    overdueReminders,
    avgExecutionProgress,
    stageDistribution,
    currencyBreakdown,
    lastSync: settings?.last_sync_at ?? null
  };
}

export async function getRecentExceptions(limit = 5) {
  const supabase = await createClient();
  const { data } = await supabase
    .from('exceptions')
    .select('id, project_id, type, severity, message, status, created_at, projects(code, name)')
    .eq('status', 'open')
    .order('created_at', { ascending: false })
    .limit(limit);
  return data ?? [];
}

export async function getRecentProjects(limit = 8) {
  const supabase = await createClient();
  const { data } = await supabase
    .from('projects')
    .select('id, code, name, health, current_stage, currency, contract_value, updated_at')
    .eq('archived', false)
    .order('updated_at', { ascending: false })
    .limit(limit);
  return data ?? [];
}

export async function getTodayReminders(limit = 5) {
  const supabase = await createClient();
  const { data } = await supabase
    .from('reminders')
    .select('id, project_id, message, due_at, status, projects(code, name)')
    .eq('status', 'pending')
    .order('due_at', { ascending: true })
    .limit(limit);
  return data ?? [];
}
