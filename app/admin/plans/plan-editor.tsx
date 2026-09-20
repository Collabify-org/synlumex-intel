'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Save, X } from 'lucide-react';
import { formatMoney } from '@/lib/format';

type Plan = {
  id: string;
  name: string;
  description: string | null;
  price_monthly: number;
  price_yearly: number;
  max_projects: number | null;
  max_users: number | null;
  max_ai_extractions_monthly: number | null;
  is_active: boolean;
};

export function PlanEditor({ plans }: { plans: Plan[] }) {
  const router = useRouter();
  const supabase = createClient();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<Partial<Plan>>({});

  function startEdit(plan: Plan) {
    setEditingId(plan.id);
    setForm({ ...plan });
  }

  async function save() {
    if (!editingId) return;
    setLoading(true);
    const { error } = await supabase
      .from('plans')
      .update({
        name: form.name,
        description: form.description,
        price_monthly: Number(form.price_monthly ?? 0),
        price_yearly: Number(form.price_yearly ?? 0),
        max_projects: form.max_projects === null ? null : Number(form.max_projects ?? 0) || null,
        max_users: form.max_users === null ? null : Number(form.max_users ?? 0) || null,
        max_ai_extractions_monthly:
          form.max_ai_extractions_monthly === null
            ? null
            : Number(form.max_ai_extractions_monthly ?? 0) || null
      })
      .eq('id', editingId);
    setLoading(false);
    if (!error) {
      setEditingId(null);
      router.refresh();
    }
  }

  return (
    <div className="space-y-4">
      {plans.map((plan) => {
        const editing = editingId === plan.id;
        return (
          <div key={plan.id} className="border border-border rounded-lg p-4">
            {!editing ? (
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{plan.name}</h3>
                    <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
                      {plan.id}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{plan.description}</p>
                  <div className="flex gap-4 mt-3 text-xs flex-wrap">
                    <div>
                      <span className="text-muted-foreground">Monthly:</span>{' '}
                      <span className="font-mono">{formatMoney(Number(plan.price_monthly), 'INR')}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Yearly:</span>{' '}
                      <span className="font-mono">{formatMoney(Number(plan.price_yearly), 'INR')}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Projects:</span>{' '}
                      <span className="font-mono">{plan.max_projects ?? '∞'}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Users:</span>{' '}
                      <span className="font-mono">{plan.max_users ?? '∞'}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">AI/mo:</span>{' '}
                      <span className="font-mono">{plan.max_ai_extractions_monthly ?? '∞'}</span>
                    </div>
                  </div>
                </div>
                <Button size="sm" variant="outline" onClick={() => startEdit(plan)}>
                  Edit
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Editing {plan.name}</h3>
                  <button
                    onClick={() => setEditingId(null)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      Name
                    </Label>
                    <Input
                      value={form.name ?? ''}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      Description
                    </Label>
                    <Input
                      value={form.description ?? ''}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      Price Monthly (INR)
                    </Label>
                    <Input
                      type="number"
                      value={form.price_monthly ?? 0}
                      onChange={(e) => setForm({ ...form, price_monthly: Number(e.target.value) })}
                    />
                  </div>
                  <div>
                    <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      Price Yearly (INR)
                    </Label>
                    <Input
                      type="number"
                      value={form.price_yearly ?? 0}
                      onChange={(e) => setForm({ ...form, price_yearly: Number(e.target.value) })}
                    />
                  </div>
                  <div>
                    <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      Max Projects (blank = ∞)
                    </Label>
                    <Input
                      type="number"
                      value={form.max_projects ?? ''}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          max_projects: e.target.value === '' ? null : Number(e.target.value)
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      Max Users (blank = ∞)
                    </Label>
                    <Input
                      type="number"
                      value={form.max_users ?? ''}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          max_users: e.target.value === '' ? null : Number(e.target.value)
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      Max AI/month (blank = ∞)
                    </Label>
                    <Input
                      type="number"
                      value={form.max_ai_extractions_monthly ?? ''}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          max_ai_extractions_monthly:
                            e.target.value === '' ? null : Number(e.target.value)
                        })
                      }
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="sm" onClick={() => setEditingId(null)}>
                    Cancel
                  </Button>
                  <Button size="sm" onClick={save} disabled={loading} className="brand-gradient">
                    {loading ? (
                      <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                    ) : (
                      <Save className="mr-2 h-3 w-3" />
                    )}
                    Save
                  </Button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
