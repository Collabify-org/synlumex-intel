import { AdminLoginForm } from './admin-login-form';
import { Crown } from 'lucide-react';

export default function AdminLoginPage() {
  return (
    <div className="w-full max-w-md px-6">
      <div className="flex flex-col items-center mb-10">
        <div className="h-14 w-14 rounded-xl flex items-center justify-center mb-4 brand-gradient brand-glow">
          <Crown className="h-7 w-7 text-white" strokeWidth={2.5} />
        </div>
        <h1 className="text-2xl font-bold tracking-tight">SYNLUMEX ADMIN</h1>
        <p className="text-sm text-muted-foreground mt-1 font-mono">
          Restricted Access · Super Admin Only
        </p>
      </div>

      <div className="rounded-xl border border-border bg-card p-6 card-glow">
        <div className="mb-6">
          <h2 className="text-lg font-semibold">Admin Sign In</h2>
          <p className="text-xs text-muted-foreground mt-1">
            Authorized personnel only. All access is logged.
          </p>
        </div>
        <AdminLoginForm />
      </div>

      <p className="text-center text-xs text-muted-foreground mt-6 font-mono">
        Not an admin?{' '}
        <a href="/login" className="text-brand-cyan hover:underline">
          Return to client login
        </a>
      </p>
    </div>
  );
}
