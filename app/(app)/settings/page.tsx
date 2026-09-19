import { createClient } from '@/lib/supabase/server';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Settings as SettingsIcon, User, Database, Sparkles, AlertTriangle, Clock } from 'lucide-react';
import { timeAgo } from '@/lib/format';

export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user?.id ?? '')
    .single();
  const { data: settings } = await supabase.from('settings').select('*').single();

  const { count: projectCount } = await supabase
    .from('projects')
    .select('*', { count: 'exact', head: true });

  const { count: exceptionCount } = await supabase
    .from('exceptions')
    .select('*', { count: 'exact', head: true });

  const { count: boqCount } = await supabase
    .from('boq_items')
    .select('*', { count: 'exact', head: true });

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <SettingsIcon className="h-6 w-6 text-brand" /> Settings
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Workspace configuration and account details
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Card className="p-5 bg-card/50">
          <div className="flex items-center gap-2 mb-4">
            <User className="h-4 w-4 text-brand" />
            <h3 className="font-semibold">Account</h3>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Name</span>
              <span className="font-medium">{profile?.full_name ?? '—'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Email</span>
              <span className="font-mono text-xs">{profile?.email ?? user?.email ?? '—'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Role</span>
              <Badge variant={profile?.role === 'owner' ? 'green' : 'secondary'} className="capitalize">
                {profile?.role ?? 'member'}
              </Badge>
            </div>
          </div>
        </Card>

        <Card className="p-5 bg-card/50">
          <div className="flex items-center gap-2 mb-4">
            <Database className="h-4 w-4 text-blue-400" />
            <h3 className="font-semibold">Workspace Data</h3>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Company</span>
              <span className="font-medium">{settings?.company_name ?? 'SYNLUMEX INTEL'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Projects</span>
              <span className="font-mono">{projectCount ?? 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Exceptions</span>
              <span className="font-mono">{exceptionCount ?? 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">BOQ Items</span>
              <span className="font-mono">{boqCount ?? 0}</span>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-5 bg-card/50 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="h-4 w-4 text-brand" />
          <h3 className="font-semibold">AI Configuration</h3>
        </div>
        <div className="space-y-3 text-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">BOQ Extraction</div>
              <div className="text-xs text-muted-foreground mt-0.5">
                Paste text or upload PDF → structured line items
              </div>
            </div>
            <Badge variant="green">Active</Badge>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Risk Analysis</div>
              <div className="text-xs text-muted-foreground mt-0.5">
                AI-generated project risk bullets for owners
              </div>
            </div>
            <Badge variant="green">Active</Badge>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Provider Fallback</div>
              <div className="text-xs text-muted-foreground mt-0.5">
                Groq → Cerebras → SambaNova → Gemini
              </div>
            </div>
            <Badge variant="green">Enabled</Badge>
          </div>
        </div>
      </Card>

      <Card className="p-5 bg-card/50 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <h3 className="font-semibold">The Loop</h3>
        </div>
        <div className="text-sm">
          <div className="flex justify-between mb-2">
            <span className="text-muted-foreground">Last recompute</span>
            <span className="font-mono text-xs">
              {settings?.last_sync_at ? timeAgo(settings.last_sync_at) : 'never'}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-3 leading-relaxed">
            Every mutation to billing, collections, and exceptions triggers{' '}
            <code className="text-brand font-mono text-[10px]">recomputeProjectState()</code>{' '}
            — which updates project health, writes audit logs, and refreshes the timestamp above.
          </p>
        </div>
      </Card>

      <Card className="p-5 bg-card/50 border-destructive/30">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="h-4 w-4 text-destructive" />
          <h3 className="font-semibold text-destructive">Danger Zone</h3>
        </div>
        <p className="text-xs text-muted-foreground mb-3">
          Demo data reset and workspace actions. Use Supabase SQL Editor for safety.
        </p>
        <div className="text-[10px] font-mono text-muted-foreground">
          <div className="mb-1">Available actions via Supabase:</div>
          <ul className="space-y-1 ml-3">
            <li>• Reset all demo data: DELETE FROM projects;</li>
            <li>• Reset exceptions: DELETE FROM exceptions;</li>
            <li>• Force recompute: SELECT recompute_project_state(id) FROM projects;</li>
          </ul>
        </div>
      </Card>
    </div>
  );
}
