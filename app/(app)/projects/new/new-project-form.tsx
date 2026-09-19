'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';

type Client = { id: string; name: string };

export function NewProjectForm({ clients, suggestedCode }: { clients: Client[]; suggestedCode: string }) {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const fd = new FormData(e.currentTarget);
    const { data: { user } } = await supabase.auth.getUser();

    const { data, error } = await supabase.from('projects').insert({
      code: fd.get('code') as string,
      name: fd.get('name') as string,
      client_id: (fd.get('client_id') as string) || null,
      description: (fd.get('description') as string) || null,
      contract_value: Number(fd.get('contract_value') ?? 0),
      currency: fd.get('currency') as any,
      current_stage: fd.get('current_stage') as any,
      start_date: (fd.get('start_date') as string) || null,
      end_date: (fd.get('end_date') as string) || null,
      owner_id: user?.id ?? null
    }).select().single();

    if (error) { setError(error.message); setLoading(false); return; }
    router.push(`/projects/${data.id}`);
    router.refresh();
  }

  return (
    <Card className="p-6 bg-card/50">
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="code" className="text-xs uppercase tracking-wider text-muted-foreground">Project Code</Label>
            <Input id="code" name="code" defaultValue={suggestedCode} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="currency" className="text-xs uppercase tracking-wider text-muted-foreground">Currency</Label>
            <select id="currency" name="currency" defaultValue="INR"
              className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm">
              <option value="INR">INR — Indian Rupee</option>
              <option value="USD">USD — US Dollar</option>
              <option value="SAR">SAR — Saudi Riyal</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="name" className="text-xs uppercase tracking-wider text-muted-foreground">Project Name</Label>
          <Input id="name" name="name" required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="client_id" className="text-xs uppercase tracking-wider text-muted-foreground">Client</Label>
          <select id="client_id" name="client_id"
            className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm">
            <option value="">— None —</option>
            {clients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="contract_value" className="text-xs uppercase tracking-wider text-muted-foreground">Contract Value</Label>
            <Input id="contract_value" name="contract_value" type="number" step="0.01" defaultValue="0" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="current_stage" className="text-xs uppercase tracking-wider text-muted-foreground">Starting Stage</Label>
            <select id="current_stage" name="current_stage" defaultValue="intake"
              className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm">
              <option value="intake">Intake</option>
              <option value="requirements">Requirements</option>
              <option value="boq">BOQ</option>
              <option value="estimation">Estimation</option>
              <option value="engineering">Engineering</option>
              <option value="procurement">Procurement</option>
              <option value="execution">Execution</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="start_date" className="text-xs uppercase tracking-wider text-muted-foreground">Start Date</Label>
            <Input id="start_date" name="start_date" type="date" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="end_date" className="text-xs uppercase tracking-wider text-muted-foreground">End Date</Label>
            <Input id="end_date" name="end_date" type="date" />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description" className="text-xs uppercase tracking-wider text-muted-foreground">Description</Label>
          <textarea id="description" name="description" rows={3}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
        </div>

        {error && (
          <div className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive">{error}</div>
        )}

        <div className="flex gap-2 justify-end pt-2">
          <Button type="button" variant="ghost" onClick={() => router.back()}>Cancel</Button>
          <Button type="submit" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Project
          </Button>
        </div>
      </form>
    </Card>
  );
}
