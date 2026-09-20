'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, LogOut, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ImpersonationBanner({ orgName }: { orgName: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function stopImpersonating() {
    setLoading(true);
    await fetch('/api/admin/impersonate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'stop' })
    });
    router.push('/admin');
    router.refresh();
  }

  return (
    <div className="h-10 shrink-0 bg-amber-500/15 border-b border-amber-500/40 flex items-center px-4 gap-3 z-[60]">
      <Eye className="h-4 w-4 text-amber-400 shrink-0" />
      <div className="text-xs text-amber-200 flex-1">
        <span className="font-semibold">Viewing as:</span> {orgName}
        <span className="text-amber-400/70 ml-2 font-mono">
          · Support mode · all actions logged
        </span>
      </div>
      <Button
        size="sm"
        variant="outline"
        onClick={stopImpersonating}
        disabled={loading}
        className="h-7 text-xs border-amber-500/40 text-amber-200 hover:bg-amber-500/20"
      >
        {loading ? (
          <Loader2 className="mr-1.5 h-3 w-3 animate-spin" />
        ) : (
          <LogOut className="mr-1.5 h-3 w-3" />
        )}
        Exit View
      </Button>
    </div>
  );
}
