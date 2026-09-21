import Link from 'next/link';
import {
  ShieldCheck, Target, TrendingUp, Sparkles, HardHat, Factory,
  Truck, Building2, MessageCircle, ArrowRight, Zap, Droplet, Pickaxe,
  LayoutGrid, FolderKanban, Banknote, AlertTriangle, Brain, Bell,
  BarChart3, Lock
} from 'lucide-react';
import { Logo } from '@/components/brand/logo';
import { Reveal } from '@/components/marketing/reveal';

const WHATSAPP_URL = 'https://wa.me/919390785041?text=Hi%2C%20I%27d%20like%20to%20know%20more%20about%20SYNLUMEX';

export const metadata = {
  title: 'About — SYNLUMEX INTEL',
  description: 'Operating system for project-driven businesses. Connect intake, execution, billing, and compliance in one closed loop.'
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <nav className="sticky top-0 z-40 h-16 border-b border-border bg-background/80 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto h-full px-6 flex items-center justify-between">
          <Link href="/" className="group flex items-center">
            <Logo size={28} interactive />
          </Link>
          <Link
            href="/login"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Sign in
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative py-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-radial-glow pointer-events-none opacity-50" />
        <div className="max-w-4xl mx-auto relative">
          <Reveal>
            <div className="text-xs font-mono tracking-widest text-brand-cyan uppercase mb-3">
              ABOUT
            </div>
            <h1 className="text-3xl md:text-5xl font-semibold tracking-[-0.035em] leading-[1.05] mb-6">
              Built for the teams running the projects
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl">
              SYNLUMEX INTEL is an operating system for project-driven businesses. We connect the
              entire project lifecycle — intake, execution, billing, and compliance — into one
              closed-loop system so owners and project leaders can see what&apos;s happening and act
              on it.
            </p>
          </Reveal>
        </div>
      </section>

      {/* What we bring */}
      <section className="py-16 px-6 border-t border-border">
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <h2 className="text-2xl md:text-3xl font-semibold tracking-[-0.025em] mb-10">
              What SYNLUMEX brings
            </h2>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Target,
                title: 'Intake to Execution',
                body: 'A structured 14-stage lifecycle from requirements to closeout. Every stage has owners, gates, evidence, and metrics. BOQ intelligence extracts structured items from any document.'
              },
              {
                icon: TrendingUp,
                title: 'Execution to Money',
                body: 'Progress, billing, and collection connected. See unbilled revenue, collection efficiency, and cash gaps in real time — visibility that ERP tools cannot give you.'
              },
              {
                icon: Sparkles,
                title: 'Intelligence Layer',
                body: 'The Loop: every mutation triggers recompute, exceptions, and reminders. AI risk analysis. Historical intelligence that compounds across projects.'
              }
            ].map((item, i) => (
              <Reveal key={i} delay={(i * 100) as 0 | 100 | 200}>
                <div className="glass-card rounded-lg p-6 hover-lift h-full">
                  <div className="h-10 w-10 rounded-md brand-gradient flex items-center justify-center mb-4">
                    <item.icon className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* The Loop */}
      <section className="py-16 px-6 bg-secondary/40">
        <div className="max-w-3xl mx-auto">
          <Reveal>
            <h2 className="text-2xl md:text-3xl font-semibold tracking-[-0.025em] mb-6">
              Our unique angle: The Loop
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Most project tools stop at record-keeping. You enter data, you pull a report, and
              that&apos;s the end of it. Information sits in silos. Issues surface late. Money
              gets stuck.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              SYNLUMEX INTEL runs The Loop. When anyone updates anything — progress, billing, a
              stage change — the system recomputes project health, creates exceptions where rules
              are breached, notifies the accountable person, and writes an immutable audit entry.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              The result: nobody has to remember to chase. The system surfaces what matters, when
              it matters, to the person who owns it.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Capabilities grid */}
      <section className="py-16 px-6 border-t border-border">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <h2 className="text-2xl md:text-3xl font-semibold tracking-[-0.025em] mb-10">
              Nine capabilities. One console.
            </h2>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-4">
            {[
              { icon: LayoutGrid, title: 'Owner Command Center' },
              { icon: FolderKanban, title: '14-Stage Lifecycle' },
              { icon: Banknote, title: 'Commercial Visibility' },
              { icon: AlertTriangle, title: 'Exception Engine' },
              { icon: Sparkles, title: 'AI BOQ Extraction' },
              { icon: Brain, title: 'AI Risk Analysis' },
              { icon: Bell, title: 'Smart Reminders' },
              { icon: BarChart3, title: 'Historical Intelligence' },
              { icon: Lock, title: 'Audit Trail' }
            ].map((item, i) => (
              <Reveal key={i} delay={((i % 3) * 100) as 0 | 100 | 200}>
                <div className="group glass-card rounded-lg p-5 hover-lift h-full">
                  <div className="h-9 w-9 rounded-md bg-brand/10 border border-brand/30 flex items-center justify-center mb-3 hover-icon-glow">
                    <item.icon className="h-4 w-4 text-brand-cyan group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="font-semibold text-sm">{item.title}</h3>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Industries */}
      <section className="py-16 px-6 bg-secondary/40">
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <h2 className="text-2xl md:text-3xl font-semibold tracking-[-0.025em] mb-10">
              Built for project-driven industries
            </h2>
          </Reveal>

          <div className="grid md:grid-cols-2 gap-4">
            {[
              { icon: HardHat, title: 'EPC & Construction', body: 'Multiplex, thermal, industrial plants — from small to multi-billion portfolios.' },
              { icon: Zap, title: 'Energy & Utilities', body: 'Solar, wind, transmission. Capital projects with high overrun risk.' },
              { icon: Factory, title: 'Manufacturing', body: 'Plant upgrades, capacity expansions, multi-vendor coordination.' },
              { icon: Droplet, title: 'Oil & Gas', body: 'Refineries, pipelines, LNG. Complex compliance, tight margins.' },
              { icon: Truck, title: 'Logistics & Infrastructure', body: 'Ports, rail, highways. Multi-stakeholder, multi-year coordination.' },
              { icon: Pickaxe, title: 'Mining & Metals', body: 'Multi-billion dollar capital projects. Chronic delays, budget drift.' }
            ].map((item, i) => (
              <Reveal key={i} delay={((i % 2) * 100) as 0 | 100}>
                <div className="glass-card rounded-lg p-5 flex gap-4 hover-lift h-full">
                  <div className="h-10 w-10 rounded-md brand-gradient flex items-center justify-center shrink-0">
                    <item.icon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1 text-sm">{item.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{item.body}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Vision */}
      <section className="py-16 px-6 border-t border-border">
        <div className="max-w-3xl mx-auto">
          <Reveal>
            <h2 className="text-2xl md:text-3xl font-semibold tracking-[-0.025em] mb-6">
              Our vision
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Project-driven businesses run on information flowing between people, systems, and
              organizations. But in most companies, that flow breaks — in email threads, WhatsApp
              groups, spreadsheets, and people&apos;s heads.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We believe the gap can be closed with visibility, not more paperwork. That owners
              shouldn&apos;t have to wait for weekly reports. That exceptions shouldn&apos;t surface
              a month later. That margin shouldn&apos;t die silently in handoffs.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              SYNLUMEX gives owners and project leaders a single console where the entire portfolio
              is visible, in real time, with action tracked to accountable people.
            </p>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 border-t border-border">
        <div className="max-w-3xl mx-auto text-center">
          <Reveal>
            <h2 className="text-2xl md:text-4xl font-semibold tracking-[-0.03em] mb-4">
              Ready to see it in action?
            </h2>
            <p className="text-muted-foreground mb-8">
              15-minute walkthrough. We&apos;ll map your existing workflow onto SYNLUMEX in real time.
            </p>
          </Reveal>
          <Reveal delay={100}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group rounded-md brand-gradient-animated text-white px-6 py-3 text-sm font-semibold btn-primary flex items-center gap-2"
              >
                <MessageCircle className="h-4 w-4" /> WhatsApp us
                <ArrowRight className="h-4 w-4 btn-arrow" />
              </a>
              <a
                href="mailto:abdul@synlumexai.com"
                className="rounded-md border border-border bg-card px-6 py-3 text-sm font-medium hover:bg-secondary transition-colors"
              >
                sales@synlumexai.com
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      <footer className="border-t border-border py-10 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-muted-foreground font-mono">
          <div>© 2026 SYNLUMEX</div>
          <div className="flex flex-wrap items-center gap-4">
            <Link href="/" className="hover:text-foreground">Home</Link>
            <Link href="/privacy" className="hover:text-foreground">Privacy</Link>
            <Link href="/terms" className="hover:text-foreground">Terms</Link>
            <Link href="/refund" className="hover:text-foreground">Refund</Link>
            <Link href="/disclaimer" className="hover:text-foreground">Disclaimer</Link>
            <Link href="/contact" className="hover:text-foreground">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
