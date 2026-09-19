import { LoginForm } from './login-form';
import { ShieldCheck } from 'lucide-react';

export default function LoginPage() {
  return (
    <div className="w-full max-w-md px-6">
      <div className="flex flex-col items-center mb-10">
        <div className="h-14 w-14 rounded-xl flex items-center justify-center mb-4 brand-gradient brand-glow">
          <ShieldCheck className="h-7 w-7 text-white" strokeWidth={2.5} />
        </div>
        <h1 className="text-2xl font-bold tracking-tight">SYNLUMEX INTEL</h1>
        <p className="text-sm text-muted-foreground mt-1 font-mono">
          Owner-side EPC Operating System
        </p>
      </div>

      <div className="rounded-xl border border-border bg-card p-6 card-glow">
        <div className="mb-6">
          <h2 className="text-lg font-semibold">Sign in</h2>
          <p className="text-xs text-muted-foreground mt-1">
            Access is restricted. Accounts are provisioned manually.
          </p>
        </div>
        <LoginForm />
      </div>

      <p className="text-center text-xs text-muted-foreground mt-6 font-mono">
        No public signup · Authorized access only
      </p>
    </div>
  );
}
