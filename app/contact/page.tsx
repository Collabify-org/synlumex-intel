import Link from 'next/link';
import { Logo } from '@/components/brand/logo';
import { Reveal } from '@/components/marketing/reveal';
import { ArrowLeft, MessageCircle, Mail, Instagram, Linkedin } from 'lucide-react';

const WHATSAPP_URL = 'https://wa.me/919390785041?text=Hi%2C%20I%27d%20like%20to%20know%20more%20about%20SYNLUMEX';
const EMAIL = 'abdul@synlumexai.com';
const INSTAGRAM_URL = 'https://www.instagram.com/abdul.synlumex/';
const LINKEDIN_URL = 'https://www.linkedin.com/company/synlumex/?viewAsMember=true';

export const metadata = {
  title: 'Contact — SYNLUMEX INTEL',
  description: 'Get in touch with SYNLUMEX. Book a demo or ask us anything.'
};

export default function ContactPage() {
  const channels = [
    {
      icon: MessageCircle,
      label: 'WhatsApp',
      value: 'Chat with us on WhatsApp',
      href: WHATSAPP_URL,
      brandBg: 'bg-[#25D366]/10',
      brandBorder: 'border-[#25D366]/30',
      brandColor: 'text-[#25D366]'
    },
    {
      icon: Mail,
      label: 'Email',
      value: 'Send us an email',
      href: `mailto:${EMAIL}?subject=SYNLUMEX%20Inquiry`,
      brandBg: 'bg-[#0ea5e9]/10',
      brandBorder: 'border-[#0ea5e9]/30',
      brandColor: 'text-[#0ea5e9]'
    },
    {
      icon: Instagram,
      label: 'Instagram',
      value: 'Follow us on Instagram',
      href: INSTAGRAM_URL,
      brandBg: 'bg-gradient-to-br from-[#833AB4]/10 via-[#FD1D1D]/10 to-[#FCAF45]/10',
      brandBorder: 'border-[#E1306C]/30',
      brandColor: 'text-[#E1306C]'
    },
    {
      icon: Linkedin,
      label: 'LinkedIn',
      value: 'Connect on LinkedIn',
      href: LINKEDIN_URL,
      brandBg: 'bg-[#0A66C2]/10',
      brandBorder: 'border-[#0A66C2]/30',
      brandColor: 'text-[#0A66C2]'
    }
  ];

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

      <section className="relative py-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-radial-glow pointer-events-none opacity-50" />
        <div className="max-w-3xl mx-auto text-center relative">
          <Reveal>
            <div className="text-xs font-mono tracking-widest text-brand-cyan uppercase mb-3">
              CONTACT
            </div>
            <h1 className="text-3xl md:text-5xl font-semibold tracking-[-0.035em] leading-[1.05] mb-6">
              Get in touch
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Book a demo, ask about pricing, or just say hello. Pick the channel that works for
              you — we usually respond within a few hours.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="pb-20 px-6">
        <div className="max-w-2xl mx-auto space-y-3">
          {channels.map((c, i) => {
            const Icon = c.icon;
            return (
              <Reveal key={c.label} delay={((i % 4) * 100) as 0 | 100 | 200 | 300}>
                <a
                  href={c.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group glass-card rounded-xl p-5 hover-lift flex items-center gap-4"
                >
                  <div
                    className={`h-12 w-12 rounded-xl ${c.brandBg} border ${c.brandBorder} flex items-center justify-center shrink-0`}
                  >
                    <Icon className={`h-5 w-5 ${c.brandColor}`} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[10px] font-mono tracking-widest text-muted-foreground uppercase">
                      {c.label}
                    </div>
                    <div className="text-sm font-medium text-foreground truncate mt-0.5">
                      {c.value}
                    </div>
                  </div>
                  <span className="text-brand-cyan text-lg group-hover:translate-x-1 transition-transform">
                    →
                  </span>
                </a>
              </Reveal>
            );
          })}
        </div>

        <div className="max-w-2xl mx-auto mt-12 glass-card rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">What to expect</h2>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-3">
              <span className="text-brand-cyan mt-0.5">→</span>
              <span>We usually respond within a few hours during business days</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-brand-cyan mt-0.5">→</span>
              <span>Demos are 15 minutes, via video call, with a walkthrough of the platform</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-brand-cyan mt-0.5">→</span>
              <span>We set up your workspace manually after the demo — no self-signup required</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-brand-cyan mt-0.5">→</span>
              <span>14-day free trial on the Pro plan to test with your real workflows</span>
            </li>
          </ul>
        </div>
      </section>

      <footer className="border-t border-border py-10 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-muted-foreground font-mono">
          <div>© 2026 SYNLUMEX</div>
          <div className="flex flex-wrap items-center gap-4">
            <Link href="/" className="hover:text-foreground">Home</Link>
            <Link href="/about" className="hover:text-foreground">About</Link>
            <Link href="/privacy" className="hover:text-foreground">Privacy</Link>
            <Link href="/terms" className="hover:text-foreground">Terms</Link>
            <Link href="/refund" className="hover:text-foreground">Refund</Link>
            <Link href="/disclaimer" className="hover:text-foreground">Disclaimer</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
