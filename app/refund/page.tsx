import Link from 'next/link';
import { Logo } from '@/components/brand/logo';
import { ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'Refund Policy — SYNLUMEX INTEL',
  description: 'Refund and cancellation policy for SYNLUMEX INTEL subscriptions.'
};

export default function RefundPage() {
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
          Refund & Cancellation Policy
        </h1>
        <p className="text-sm text-muted-foreground font-mono mb-12">
          Last updated: 22 September 2026
        </p>

        <div className="space-y-8 text-sm leading-relaxed text-muted-foreground">
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">
              1. Overview
            </h2>
            <p>
              This policy applies to all SYNLUMEX INTEL subscription plans. It covers refunds,
              cancellations, and downgrades.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">
              2. Free trial
            </h2>
            <p>
              Every new customer is eligible for a <strong className="text-foreground">14-day
              free trial on the Pro plan</strong>. No credit card is required. If you do not wish
              to continue after the trial, no charge is applied.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">
              3. Monthly subscriptions
            </h2>
            <p>
              Monthly subscriptions can be cancelled at any time. Cancellation takes effect at the
              end of the current billing period — you retain access until then. We do not provide
              prorated refunds for partial months.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">
              4. Annual subscriptions
            </h2>
            <p>
              Annual subscriptions can be cancelled within <strong className="text-foreground">7
              days of payment</strong> for a full refund, provided the account has used less than
              10% of the plan's AI extraction quota. After 7 days, no refund is provided for the
              remaining term, but you retain access until the end of the annual period.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">
              5. Exceptional refunds
            </h2>
            <p>
              If we fail to provide the service as agreed — for reasons within our control — you
              may be eligible for a refund. Requests are reviewed case-by-case and responded to
              within 48 hours.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">
              6. Non-refundable items
            </h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>Any amount consumed beyond the refund window (e.g., annual subscriptions after 7 days)</li>
              <li>Custom setup, onboarding, or implementation services once delivered</li>
              <li>Third-party costs passed through (payment gateway fees, cloud costs)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">
              7. How to request a refund
            </h2>
            <p>
              Email{' '}
              <a href="mailto:abdul@synlumexai.com" className="text-brand-cyan hover:underline">
                abdul@synlumexai.com
              </a>{' '}
              with:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Your registered email</li>
              <li>Reason for refund request</li>
              <li>Payment date and reference number</li>
            </ul>
            <p className="mt-3">
              Approved refunds are processed within 10 business days to the original payment
              method.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">
              8. Downgrades
            </h2>
            <p>
              You may downgrade your plan at any time. Downgrades take effect at the end of the
              current billing period. No refund is provided for the price difference mid-cycle.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">
              9. Contact
            </h2>
            <p>
              Questions?{' '}
              <a href="mailto:abdul@synlumexai.com" className="text-brand-cyan hover:underline">
                abdul@synlumexai.com
              </a>{' '}
              · WhatsApp +91 93907 85041
            </p>
          </section>
        </div>

        <div className="mt-16 pt-8 border-t border-border flex flex-wrap items-center gap-4 text-xs text-muted-foreground font-mono">
          <Link href="/" className="hover:text-foreground">Home</Link>
          <Link href="/privacy" className="hover:text-foreground">Privacy</Link>
          <Link href="/terms" className="hover:text-foreground">Terms</Link>
          <Link href="/disclaimer" className="hover:text-foreground">Disclaimer</Link>
          <Link href="/about" className="hover:text-foreground">About</Link>
          <Link href="/contact" className="hover:text-foreground">Contact</Link>
        </div>
      </div>
    </div>
  );
}
