'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Eye, Loader2 } from 'lucide-react';

export function ImpersonateButton({ orgId }: { orgId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function start() {
    setLoading(true);
    setError(null);
    const res = await fetch('/api/admin/impersonate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orgId, action: 'start' })
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? 'Failed');
      setLoading(false);
      return;
    }
    router.push('/dashboard');
    router.refresh();
  }

  return (
    <div>
      <Button
        size="sm"
        variant="outline"
        onClick={start}
        disabled={loading}
        className="border-amber-500/40 text-amber-300 hover:bg-amber-500/10"
      >
        {loading ? (
          <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
        ) : (
          <Eye className="mr-2 h-3.5 w-3.5" />
        )}
        View as this client
      </Button>
      {error && (
        <div className="mt-2 text-xs text-destructive">{error}</div>
      )}
    </div>
  );
}
