import { LoginForm } from './login-form';
import { Logo } from '@/components/brand/logo';

export default function LoginPage() {
  return (
    <div className="w-full max-w-md px-6">
      <div className="flex flex-col items-center mb-10">
        <div className="mb-6">
          <Logo size={64} interactive priority />
        </div>
        <h1 className="text-2xl font-bold tracking-tight">SYNLUMEX INTEL</h1>
        <p className="text-sm text-muted-foreground mt-1 font-mono">
          Operating System for Project Businesses
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
