'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UserPlus, Loader2, X, Check } from 'lucide-react';

export function AddUser({ orgId }: { orgId: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'owner' | 'member'>('owner');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  function reset() {
    setEmail('');
    setFullName('');
    setPassword('');
    setRole('owner');
    setError(null);
    setSuccess(null);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    const res = await fetch('/api/admin/create-user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, fullName, role, orgId })
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error ?? 'Failed to create user');
      setLoading(false);
      return;
    }

    setSuccess(`User ${data.email} created. They can log in now.`);
    setEmail('');
    setFullName('');
    setPassword('');
    setRole('owner');
    setLoading(false);
    router.refresh();

    // Auto-hide success after 4 seconds
    setTimeout(() => setSuccess(null), 4000);
  }

  if (!open) {
    return (
      <div className="p-4 border-b border-border">
        <Button size="sm" onClick={() => setOpen(true)} className="brand-gradient">
          <UserPlus className="mr-2 h-3.5 w-3.5" />
          Add User
        </Button>
      </div>
    );
  }

  return (
    <div className="p-5 border-b border-border bg-background/40">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <UserPlus className="h-4 w-4 text-brand-cyan" />
          <h3 className="font-semibold">Add User to Organization</h3>
        </div>
        <button
          onClick={() => {
            reset();
            setOpen(false);
          }}
          className="text-muted-foreground hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Email *
            </Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="client@company.com"
              required
              autoFocus
            />
          </div>
          <div className="space-y-2">
            <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Full Name
            </Label>
            <Input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Rajiv Verma"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Password * (min 8 chars)
            </Label>
            <Input
              type="text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="TemporaryPass@2026"
              required
              minLength={8}
            />
            <p className="text-[10px] font-mono text-muted-foreground">
              Share this with the user · they can change it later
            </p>
          </div>
          <div className="space-y-2">
            <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Role in Org
            </Label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setRole('owner')}
                className={`flex-1 rounded-md border px-3 py-2 text-sm transition-all ${
                  role === 'owner'
                    ? 'border-brand-cyan bg-brand/10'
                    : 'border-border bg-background/40 hover:border-brand-cyan/40'
                }`}
              >
                Owner
              </button>
              <button
                type="button"
                onClick={() => setRole('member')}
                className={`flex-1 rounded-md border px-3 py-2 text-sm transition-all ${
                  role === 'member'
                    ? 'border-brand-cyan bg-brand/10'
                    : 'border-border bg-background/40 hover:border-brand-cyan/40'
                }`}
              >
                Member
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive">
            {error}
          </div>
        )}

        {success && (
          <div className="rounded-md border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-400 flex items-center gap-2">
            <Check className="h-3 w-3" />
            {success}
          </div>
        )}

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              reset();
              setOpen(false);
            }}
          >
            Cancel
          </Button>
          <Button type="submit" size="sm" disabled={loading} className="brand-gradient">
            {loading && <Loader2 className="mr-2 h-3 w-3 animate-spin" />}
            Create User
          </Button>
        </div>
      </form>
    </div>
  );
}
