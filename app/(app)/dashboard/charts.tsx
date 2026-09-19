'use client';

import { Card } from '@/components/ui/card';
import { STAGES, type ProjectStage } from '@/lib/types';
import {
  BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell,
  PieChart, Pie, Tooltip as ReTooltip
} from 'recharts';

type StageDatum = { stage: string; count: number };

export function StageDistribution({ data }: { data: StageDatum[] }) {
  const map = new Map(data.map((d) => [d.stage, d.count]));
  const chartData = STAGES.map((s) => ({
    short: s.short,
    full: s.label,
    count: map.get(s.key) ?? 0
  }));

  return (
    <Card className="p-5 bg-card/50">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="font-semibold">Projects by Lifecycle Stage</h3>
          <p className="text-xs text-muted-foreground mt-1">
            Active projects distributed across 14 EPC stages
          </p>
        </div>
        <span className="text-[10px] font-mono px-2 py-1 rounded bg-muted text-muted-foreground">
          {chartData.reduce((s, d) => s + d.count, 0)} projects
        </span>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={chartData} barCategoryGap="30%">
          <XAxis
            dataKey="short"
            tick={{ fill: '#71717a', fontSize: 10, fontFamily: 'JetBrains Mono' }}
            axisLine={{ stroke: '#27272a' }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: '#71717a', fontSize: 10, fontFamily: 'JetBrains Mono' }}
            axisLine={false}
            tickLine={false}
            allowDecimals={false}
          />
          <ReTooltip
            cursor={{ fill: 'rgba(14,165,233,0.06)' }}
            contentStyle={{
              background: '#0a0a0a',
              border: '1px solid #27272a',
              borderRadius: 6,
              fontSize: 12
            }}
            labelFormatter={(_, payload) => payload?.[0]?.payload?.full ?? ''}
          />
          <Bar dataKey="count" radius={[3, 3, 0, 0]}>
            {chartData.map((_, i) => (
              <Cell key={i} fill={i === 6 ? '#0ea5e9' : '#1e40af'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}

export function HealthDistribution({
  onTrack, atRisk, critical, onHold
}: { onTrack: number; atRisk: number; critical: number; onHold: number }) {
  const data = [
  { name: 'On Track', value: onTrack, color: '#0ea5e9' },
  { name: 'At Risk', value: atRisk, color: '#f59e0b' },
  { name: 'Critical', value: critical, color: '#ef4444' },
  { name: 'On Hold', value: onHold, color: '#64748b' }
];
  const total = onTrack + atRisk + critical + onHold;

  return (
    <Card className="p-5 bg-card/50">
      <div className="mb-6">
        <h3 className="font-semibold">Health Distribution</h3>
        <p className="text-xs text-muted-foreground mt-1">Portfolio risk snapshot</p>
      </div>
      <div className="flex items-center gap-6">
        <div className="w-32 h-32 shrink-0">
          {total > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  innerRadius={38}
                  outerRadius={60}
                  paddingAngle={2}
                  dataKey="value"
                  stroke="none"
                >
                  {data.map((d, i) => (
                    <Cell key={i} fill={d.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
              No data
            </div>
          )}
        </div>
        <div className="flex-1 space-y-2">
          {data.map((d) => (
            <div key={d.name} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full" style={{ background: d.color }} />
                <span className="text-muted-foreground">{d.name}</span>
              </div>
              <span className="font-mono text-xs">{d.value}</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
