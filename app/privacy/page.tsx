import Link from 'next/link';
import { Logo } from '@/components/brand/logo';
import { ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'Privacy Policy — SYNLUMEX INTEL',
  description: 'How SYNLUMEX INTEL collects, uses, and protects your data.'
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <nav className="sticky top-0 z-40 h-16 border-b border-border bg-background/80 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto h-full px-6 flex items-center justify-between">
          <Link href="/" className="group flex items-center">
            <Logo size={28} interactive />
          </Link>
          <Link
            href="/"
            className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-2"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to home
          </Link>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-16">
        <div className="text-xs font-mono tracking-widest text-brand-cyan uppercase mb-3">
          LEGAL
        </div>
        <h1 className="text-3xl md:text-4xl font-semibold tracking-[-0.03em] mb-2">
          Privacy Policy
        </h1>
        <p className="text-sm text-muted-foreground font-mono mb-12">
          Last updated: 22 September 2026
        </p>

        <div className="space-y-8 text-sm leading-relaxed text-muted-foreground">
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">1. Who we are</h2>
            <p>
              SYNLUMEX INTEL ("we", "us", "our") operates an operating system for project-driven
              businesses. This Privacy Policy explains what data we collect, how we use it, and
              your rights.
            </p>
            <p className="mt-3">
              Contact:{' '}
              <a href="mailto:abdul@synlumexai.com" className="text-brand-cyan hover:underline">
                abdul@synlumexai.com
              </a>
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">
              2. Information we collect
            </h2>
            <p className="font-medium text-foreground">Account information</p>
            <p className="mt-2">
              SYNLUMEX is invite-only. When your account is provisioned, we store: full name, work
              email, company name, role, and login timestamps. We do not accept public signups.
            </p>

            <p className="font-medium text-foreground mt-4">Project and operations data</p>
            <p className="mt-2">When you use the platform, you provide:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Project details, lifecycle stages, milestones</li>
              <li>BOQ items, estimates, procurement records</li>
              <li>Uploaded PDFs (specs, contracts, BOQs) for AI extraction</li>
              <li>Execution progress updates and evidence</li>
              <li>Billing, collection, and invoice records</li>
              <li>Exceptions, reminders, and audit log entries</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">
              3. How we use your information
            </h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>Deliver the core product: lifecycle tracking, BOQ extraction, AI risk analysis, commercial visibility</li>
              <li>Authenticate users and enforce workspace isolation</li>
              <li>Send operational notifications (project health, trial reminders, weekly digests)</li>
              <li>Respond to support requests</li>
              <li>Maintain audit trails for compliance and traceability</li>
              <li>Improve reliability and detect abuse</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">
              4. Multi-tenant isolation
            </h2>
            <p>
              SYNLUMEX is a multi-tenant platform. Every organization has an isolated workspace.
              Database-level Row Level Security (RLS) enforces isolation. Our internal team cannot
              access your project data unless you explicitly authorize an impersonation session
              for support — and every impersonation is logged in your audit trail.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">5. AI processing</h2>
            <p>
              AI features use one or more third-party providers (Groq, Cerebras, OpenRouter,
              Google Gemini). When you trigger AI extraction or analysis:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Document text or project snapshot is sent to the AI provider for processing</li>
              <li>Results are returned and stored in your workspace</li>
              <li>
                <strong className="text-foreground">
                  Your data is not used to train AI models
                </strong>
              </li>
              <li>We log which provider was used for each request (for debugging)</li>
            </ul>
            <p className="mt-3">
              AI output should always be reviewed by your team before being relied on for
              financial, safety-critical, or legally binding decisions.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">
              6. How we store your information
            </h2>
            <p>
              Data is stored in a Supabase Postgres database hosted on AWS with encryption in
              transit and at rest. File uploads are stored in encrypted Supabase Storage. We retain
              account and project data for as long as your account is active. On request, we will
              delete or export your data within 30 days.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">
              7. Sharing your information
            </h2>
            <p>
              <strong className="text-foreground">We do not sell your data.</strong> We share data
              only with:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Infrastructure providers (Supabase, Vercel, Resend) strictly to operate the service</li>
              <li>AI providers, only when you trigger AI features</li>
              <li>Internal team members who need it for support, with your authorization</li>
              <li>Legal authorities, only when required by law</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">8. Your rights</h2>
            <p>You may request to:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Access a copy of your data</li>
              <li>Correct inaccurate information</li>
              <li>Delete your account and associated data</li>
              <li>Export your project data in a machine-readable format</li>
              <li>Object to specific processing activities</li>
            </ul>
            <p className="mt-3">
              Email{' '}
              <a href="mailto:abdul@synlumexai.com" className="text-brand-cyan hover:underline">
                abdul@synlumexai.com
              </a>{' '}
              to exercise any of these rights.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">
              9. Changes to this policy
            </h2>
            <p>
              We may update this policy as the product evolves. Material changes will be
              communicated by email to the account owner.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">10. Contact</h2>
            <p>
              Questions?{' '}
              <a href="mailto:abdul@synlumexai.com" className="text-brand-cyan hover:underline">
                abdul@synlumexai.com
              </a>
            </p>
          </section>
        </div>

        <div className="mt-16 pt-8 border-t border-border flex flex-wrap items-center gap-4 text-xs text-muted-foreground font-mono">
          <Link href="/" className="hover:text-foreground">Home</Link>
          <Link href="/terms" className="hover:text-foreground">Terms</Link>
          <Link href="/refund" className="hover:text-foreground">Refund</Link>
          <Link href="/disclaimer" className="hover:text-foreground">Disclaimer</Link>
          <Link href="/about" className="hover:text-foreground">About</Link>
          <Link href="/contact" className="hover:text-foreground">Contact</Link>
        </div>
      </div>
    </div>
  );
}
