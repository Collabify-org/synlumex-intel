import Link from 'next/link';
import { Logo } from '@/components/brand/logo';
import { ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'Terms of Use — SYNLUMEX INTEL',
  description: 'Terms governing the use of SYNLUMEX INTEL.'
};

export default function TermsPage() {
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
          Terms of Use
        </h1>
        <p className="text-sm text-muted-foreground font-mono mb-12">
          Last updated: 22 September 2026
        </p>

        <div className="space-y-8 text-sm leading-relaxed text-muted-foreground">
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">
              1. Acceptance of terms
            </h2>
            <p>
              By accessing or using SYNLUMEX INTEL, you agree to these Terms of Use. If you are
              using the platform on behalf of a company, you represent that you have authority to
              bind that company.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">
              2. Account provisioning
            </h2>
            <p>
              SYNLUMEX INTEL is an invite-only platform. There is no public signup. Accounts are
              provisioned by SYNLUMEX after a demo and commercial agreement. You are responsible
              for maintaining the confidentiality of your login credentials and for all activity
              under your account.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">
              3. Subscription plans and usage
            </h2>
            <p>
              The platform is offered under subscription plans with defined limits (projects,
              users, AI extraction quotas). Plan limits are visible on the pricing page and inside
              your account settings.
            </p>
            <p className="mt-3">
              We may adjust plan features, limits, or pricing with 30 days' notice to the account
              owner. Continued use after that period constitutes acceptance.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">
              4. AI features — important disclaimer
            </h2>
            <p>
              AI-powered features (BOQ extraction, risk analysis, and any future AI capabilities)
              generate automated output based on the data you provide. AI output:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Is provided as a starting point for human review</li>
              <li>May contain errors, omissions, or inaccuracies</li>
              <li>
                Should not be relied on as the sole basis for financial, contractual, safety, or
                legally binding decisions
              </li>
            </ul>
            <p className="mt-3">
              Your team remains responsible for reviewing AI output before acting on it.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">5. Acceptable use</h2>
            <p>You agree not to:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Attempt to access another organization's data</li>
              <li>Use the platform for unlawful purposes</li>
              <li>Upload content you do not have the right to upload</li>
              <li>Reverse-engineer, scrape, or resell the platform</li>
              <li>Interfere with the platform's operation or security</li>
            </ul>
            <p className="mt-3">
              We reserve the right to suspend accounts that violate these terms.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">
              6. Your data, our platform
            </h2>
            <p>
              <strong className="text-foreground">You own your data.</strong> Project data,
              documents, billing records, and other content you or your team upload remain yours.
            </p>
            <p className="mt-3">
              All intellectual property rights in SYNLUMEX INTEL — including software, design,
              branding, and documentation — remain with SYNLUMEX.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">
              7. Availability and support
            </h2>
            <p>
              We aim for high availability but do not guarantee uninterrupted service. Planned
              maintenance will be communicated in advance. Support is provided via email at{' '}
              <a href="mailto:abdul@synlumexai.com" className="text-brand-cyan hover:underline">
                abdul@synlumexai.com
              </a>{' '}
              and WhatsApp at +91 93907 85041.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">
              8. Limitation of liability
            </h2>
            <p>
              SYNLUMEX INTEL is provided on an "as is" basis. To the maximum extent permitted by
              law, our total liability arising from your use of the platform is limited to the
              fees you paid us in the 12 months preceding the claim.
            </p>
            <p className="mt-3">
              We are not liable for indirect, incidental, or consequential damages, including lost
              profits, project delays, or business interruption.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">9. Termination</h2>
            <p>
              You may cancel your subscription at any time. On cancellation, you retain access
              until the end of the current billing period. We will retain your data for 30 days
              after cancellation, during which you may request an export. After 30 days, data is
              permanently deleted.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">
              10. Changes to these terms
            </h2>
            <p>
              We may update these terms. Material changes will be communicated by email to the
              account owner at least 30 days in advance.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">11. Governing law</h2>
            <p>
              These terms are governed by the laws of India. Any disputes will be resolved in the
              courts of competent jurisdiction in India.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">12. Contact</h2>
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
          <Link href="/privacy" className="hover:text-foreground">Privacy</Link>
          <Link href="/refund" className="hover:text-foreground">Refund</Link>
          <Link href="/disclaimer" className="hover:text-foreground">Disclaimer</Link>
          <Link href="/about" className="hover:text-foreground">About</Link>
          <Link href="/contact" className="hover:text-foreground">Contact</Link>
        </div>
      </div>
    </div>
  );
}
