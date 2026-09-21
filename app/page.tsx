'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  LayoutGrid, FolderKanban, AlertTriangle, Banknote, Sparkles, Bell,
  ArrowRight, Check, Zap, Target, TrendingUp, Users,
  Factory, Truck, MessageCircle, Play,
  BarChart3, Lock, Clock, Brain, Droplet, Pickaxe, HardHat
} from 'lucide-react';
import { ContactFab } from '@/components/marketing/contact-fab';
import { Logo } from '@/components/brand/logo';
import { Reveal } from '@/components/marketing/reveal';
import { AnimatedCounter } from '@/components/marketing/animated-counter';
import { LoopDiagram } from '@/components/marketing/loop-diagram';

const WHATSAPP_URL = 'https://wa.me/919390785041?text=Hi%2C%20I%27d%20like%20a%20SYNLUMEX%20demo';

export default function HomePage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const pricing = [
    {
      name: 'Starter',
      monthly: 1499,
      yearly: 1499 * 12 * 0.83,
      tagline: 'For small teams getting started',
      features: ['10 projects', '3 team members', '100 AI extractions/month', 'Core dashboards', 'Email support'],
      highlight: false,
      cta: 'Start free trial'
    },
    {
      name: 'Pro',
      monthly: 3999,
      yearly: 3999 * 12 * 0.83,
      tagline: 'For growing project businesses',
      features: ['100 projects', '15 team members', '1,000 AI extractions/month', 'Historical intelligence', 'Priority support', 'Custom domains'],
      highlight: true,
      cta: 'Start free trial'
    },
    {
      name: 'Enterprise',
      monthly: 9999,
      yearly: 9999 * 12 * 0.83,
      tagline: 'For large portfolios',
      features: ['Unlimited projects', 'Unlimited users', 'Unlimited AI extractions', 'Full API access', 'SSO / SAML', 'Dedicated support', 'Custom SLA'],
      highlight: false,
      cta: 'Talk to sales'
    }
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: 'SYNLUMEX INTEL',
            applicationCategory: 'BusinessApplication',
            operatingSystem: 'Web',
            description:
              'Operating system for project-driven businesses. Connect intake, execution, billing, and compliance into one closed loop.',
            offers: [
              { '@type': 'Offer', name: 'Starter', price: '1499', priceCurrency: 'USD' },
              { '@type': 'Offer', name: 'Pro', price: '3999', priceCurrency: 'USD' },
              { '@type': 'Offer', name: 'Enterprise', price: '9999', priceCurrency: 'USD' }
            ]
          })
        }}
      />

      {/* ================= DARK HERO WRAPPER ================= */}
      <div className="dark-hero bg-background text-foreground">
        {/* ============ NAVBAR ============ */}
        <nav className="fixed top-0 left-0 right-0 z-50 h-16 border-b border-border bg-background/80 backdrop-blur-lg">
          <div className="max-w-7xl mx-auto h-full px-6 flex items-center justify-between">
            <Link href="/" className="group flex items-center" aria-label="SYNLUMEX home">
              <Logo size={32} interactive priority />
            </Link>

            <div className="hidden md:flex items-center gap-8 text-sm">
              <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Features</a>
              <a href="#industries" className="text-muted-foreground hover:text-foreground transition-colors">Industries</a>
              <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
              <a href="#faq" className="text-muted-foreground hover:text-foreground transition-colors">FAQ</a>
            </div>

            <div className="flex items-center gap-3">
              <Link href="/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors hidden sm:block">
                Sign in
              </Link>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group rounded-md brand-gradient text-white px-4 py-2 text-sm font-medium btn-primary flex items-center gap-2"
              >
                Book a demo
                <ArrowRight className="h-3.5 w-3.5 btn-arrow" />
              </a>
            </div>
          </div>
        </nav>

        <div className="h-16" />

        {/* ============ HERO ============ */}
        <section className="relative pt-24 pb-20 px-6 overflow-hidden">
          <div className="absolute inset-0 bg-radial-glow pointer-events-none" />
          <div className="max-w-7xl mx-auto text-center relative">
            <Reveal>
              <div className="inline-flex items-center gap-2 rounded-full border border-brand-cyan/30 bg-brand-cyan/5 px-3 py-1 text-xs font-mono tracking-wider text-brand-cyan mb-6">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-cyan animate-pulse-glow" />
                OPERATING SYSTEM FOR PROJECT BUSINESSES
              </div>
            </Reveal>

            <Reveal delay={100}>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05] mb-6 max-w-5xl mx-auto">
                Manage projects, money, and compliance in one place.
                <br />
                <span className="brand-gradient-text">You don&apos;t lose on the project. You lose on what happens between stages.</span>
              </h1>
            </Reveal>

            <Reveal delay={200}>
              <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-10 leading-relaxed">
                Run projects, track money, close the gaps. Extra spend. Silent overruns.
                Unbilled work. All invisible until it&apos;s too late.
              </p>
            </Reveal>

            <Reveal delay={300}>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-16">
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group rounded-md brand-gradient-animated text-white px-6 py-3 text-sm font-semibold btn-primary flex items-center gap-2"
                >
                  Book a 15-min demo
                  <ArrowRight className="h-4 w-4 btn-arrow" />
                </a>
                <a
                  href="#screenshot"
                  className="group rounded-md border border-border bg-card px-6 py-3 text-sm font-medium hover:bg-accent/10 transition-colors flex items-center gap-2"
                >
                  <Play className="h-4 w-4" /> See it in action
                </a>
              </div>
            </Reveal>

            <Reveal delay={400}>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto mb-12">
                <div className="rounded-lg border border-border bg-card/50 p-4">
                  <div className="text-2xl font-bold brand-gradient-text">
                    <AnimatedCounter value={945} prefix="₹" suffix=" Cr" />
                  </div>
                  <div className="text-[10px] font-mono tracking-widest text-muted-foreground uppercase mt-1">
                    Portfolio Value
                  </div>
                </div>
                <div className="rounded-lg border border-border bg-card/50 p-4">
                  <div className="text-2xl font-bold brand-gradient-text">
                    <AnimatedCounter value={12} />
                  </div>
                  <div className="text-[10px] font-mono tracking-widest text-muted-foreground uppercase mt-1">
                    Live Projects
                  </div>
                </div>
                <div className="rounded-lg border border-border bg-card/50 p-4">
                  <div className="text-2xl font-bold brand-gradient-text">
                    <AnimatedCounter value={4} />
                  </div>
                  <div className="text-[10px] font-mono tracking-widest text-muted-foreground uppercase mt-1">
                    AI Providers
                  </div>
                </div>
                <div className="rounded-lg border border-border bg-card/50 p-4">
                  <div className="text-2xl font-bold brand-gradient-text">
                    <AnimatedCounter value={14} />
                  </div>
                  <div className="text-[10px] font-mono tracking-widest text-muted-foreground uppercase mt-1">
                    Lifecycle Stages
                  </div>
                </div>
              </div>
            </Reveal>

            <Reveal delay={500}>
              <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-mono text-muted-foreground">
                <div className="flex items-center gap-2"><Lock className="h-3.5 w-3.5" /> Enterprise-grade security</div>
                <div className="flex items-center gap-2"><Clock className="h-3.5 w-3.5" /> 14-day trial</div>
                <div className="flex items-center gap-2"><Users className="h-3.5 w-3.5" /> Multi-tenant isolated</div>
                <div className="flex items-center gap-2"><Zap className="h-3.5 w-3.5" /> AI-powered</div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ============ SCREENSHOT — still dark ============ */}
        <section id="screenshot" className="pb-24 px-6">
          <div className="max-w-6xl mx-auto">
            <Reveal>
              <div className="rounded-xl border border-border bg-card overflow-hidden shadow-2xl shadow-brand/10">
                <div className="h-10 bg-card/80 border-b border-border flex items-center px-4 gap-2">
                  <div className="flex gap-1.5">
                    <div className="h-2.5 w-2.5 rounded-full bg-red-500/60" />
                    <div className="h-2.5 w-2.5 rounded-full bg-amber-500/60" />
                    <div className="h-2.5 w-2.5 rounded-full bg-emerald-500/60" />
                  </div>
                  <div className="ml-4 text-[10px] font-mono text-muted-foreground">
                    synlumex-intel.vercel.app/dashboard
                  </div>
                </div>
                <div className="p-6 bg-background">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <div className="text-xl font-bold">Owner Command Center</div>
                      <div className="text-xs text-muted-foreground mt-1">Portfolio health · 12 active projects</div>
                    </div>
                    <div className="text-[10px] font-mono text-brand-cyan">LIVE</div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="rounded-md border border-brand-cyan/30 bg-card p-4">
                      <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">Total Value</div>
                      <div className="text-2xl font-bold brand-gradient-text mt-2">₹945.20 Cr</div>
                    </div>
                    <div className="rounded-md border border-border bg-card p-4">
                      <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">At Risk</div>
                      <div className="text-2xl font-bold mt-2">0 / 2</div>
                    </div>
                    <div className="rounded-md border border-border bg-card p-4">
                      <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">Collection</div>
                      <div className="text-2xl font-bold text-amber-400 mt-2">19.4%</div>
                    </div>
                    <div className="rounded-md border border-border bg-card p-4">
                      <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">Exceptions</div>
                      <div className="text-2xl font-bold text-red-400 mt-2">10</div>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      </div>

      {/* ================= LIGHT BODY BELOW ================= */}
      <div className="bg-background text-foreground">
        {/* ============ PROBLEM ============ */}
        <section className="py-24 px-6 border-t border-border">
          <div className="max-w-7xl mx-auto">
            <Reveal>
              <div className="text-center mb-16">
                <div className="text-xs font-mono tracking-widest text-brand-cyan uppercase mb-3">THE PROBLEM</div>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                  Every project runs on Excel, email, and memory
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Your ERP tracks transactions. Your PM tool tracks tasks. But the actual work — approvals,
                  change orders, billing, compliance — lives in the gaps between them.
                </p>
              </div>
            </Reveal>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                { icon: AlertTriangle, title: 'Handoffs get lost', body: 'Change orders sit in email. Approvals wait for signatures. Billing gets delayed. Nobody knows where work is stuck.' },
                { icon: Banknote, title: 'Margin dies invisibly', body: "You know what you billed. You don't know what's stuck between execution and collection. Unbilled revenue is invisible." },
                { icon: Brain, title: 'Knowledge walks away', body: 'When your best project manager leaves, the process leaves with them. Six months later, you repeat the same mistakes.' }
              ].map((item, i) => (
                <Reveal key={i} delay={(i * 100) as 0 | 100 | 200}>
                  <div className="group rounded-lg border border-border bg-card p-6 hover-lift card-glow">
                    <div className="h-10 w-10 rounded-md bg-destructive/10 border border-destructive/30 flex items-center justify-center mb-4">
                      <item.icon className="h-5 w-5 text-destructive" />
                    </div>
                    <h3 className="font-semibold mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.body}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ============ SOLUTION ============ */}
        <section className="py-24 px-6 bg-secondary/30">
          <div className="max-w-7xl mx-auto">
            <Reveal>
              <div className="text-center mb-16">
                <div className="text-xs font-mono tracking-widest text-brand-cyan uppercase mb-3">THE SOLUTION</div>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                  One operating system. Every handoff closed.
                </h2>
              </div>
            </Reveal>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                { icon: Target, step: '01', title: 'Intake to Execution', body: 'Structured lifecycle from requirements through 14 stages to closeout. Every stage has owners, gates, and evidence.', features: ['14-stage lifecycle', 'BOQ intelligence', 'AI extraction from PDF'] },
                { icon: TrendingUp, step: '02', title: 'Execution to Money', body: 'Progress, billing, and collection — all connected. See unbilled revenue, collection efficiency, and cash gaps in real time.', features: ['Commercial visibility', 'Unbilled revenue tracking', 'Risk scoring'] },
                { icon: Sparkles, step: '03', title: 'Intelligence Layer', body: 'Every mutation triggers recompute. Exceptions auto-created. Historical patterns compound. The system gets smarter over time.', features: ['Auto-flagged exceptions', 'AI risk analysis', 'Historical intelligence'] }
              ].map((item, i) => (
                <Reveal key={i} delay={(i * 100) as 0 | 100 | 200}>
                  <div className="group rounded-lg border border-border bg-card p-6 relative overflow-hidden hover-lift card-glow">
                    <div className="absolute top-4 right-4 text-6xl font-bold text-muted/30 font-mono">{item.step}</div>
                    <div className="h-10 w-10 rounded-md brand-gradient flex items-center justify-center mb-4">
                      <item.icon className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4">{item.body}</p>
                    <ul className="space-y-1.5">
                      {item.features.map((f, j) => (
                        <li key={j} className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Check className="h-3 w-3 text-brand-cyan shrink-0" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ============ FEATURES ============ */}
        <section id="features" className="py-24 px-6 border-t border-border">
          <div className="max-w-7xl mx-auto">
            <Reveal>
              <div className="text-center mb-16">
                <div className="text-xs font-mono tracking-widest text-brand-cyan uppercase mb-3">CAPABILITIES</div>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                  Everything you need in one console
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Not a feature list. One connected operating system.
                </p>
              </div>
            </Reveal>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { icon: LayoutGrid, title: 'Command Center', body: 'Real-time portfolio KPIs — value, health, cash flow, exceptions.' },
                { icon: FolderKanban, title: '14-Stage Lifecycle', body: 'From intake to closeout. Each stage has owners, gates, and evidence.' },
                { icon: Banknote, title: 'Commercial Visibility', body: 'Execution vs billing vs collection. Unbilled revenue surfaced.' },
                { icon: AlertTriangle, title: 'Exception Engine', body: 'Auto-flags delays, overruns, collection gaps. Assigns owners.' },
                { icon: Sparkles, title: 'AI BOQ Extraction', body: 'Upload PDF or paste text. AI extracts structured line items.' },
                { icon: Brain, title: 'AI Risk Analysis', body: 'Reads project state and writes executive risk bullets.' },
                { icon: Bell, title: 'Smart Reminders', body: 'Every exception creates a tracked reminder with an owner.' },
                { icon: BarChart3, title: 'Historical Intelligence', body: 'Avg durations, delay causes, drop-off stages — compounding.' },
                { icon: Lock, title: 'Audit Trail', body: 'Every mutation logged. Every action provable. Every change tracked.' }
              ].map((item, i) => (
                <Reveal key={i} delay={((i % 3) * 100) as 0 | 100 | 200}>
                  <div className="group rounded-lg border border-border bg-card p-5 hover-lift card-glow">
                    <div className="h-9 w-9 rounded-md bg-brand/10 border border-brand/30 flex items-center justify-center mb-3 hover-icon-glow">
                      <item.icon className="h-4 w-4 text-brand-cyan group-hover:text-white transition-colors" />
                    </div>
                    <h3 className="font-semibold mb-1.5 text-sm">{item.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{item.body}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ============ THE LOOP ============ */}
        <section className="py-24 px-6 bg-secondary/30">
          <div className="max-w-6xl mx-auto">
            <Reveal>
              <div className="text-center mb-16">
                <div className="text-xs font-mono tracking-widest text-brand-cyan uppercase mb-3">THE CLOSED LOOP</div>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                  Update once. Impact everywhere.
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Most tools stop at record-keeping. SYNLUMEX runs The Loop — every update triggers
                  recompute, exceptions, and reminders automatically.
                </p>
              </div>
            </Reveal>

            <Reveal>
              <LoopDiagram />
            </Reveal>
          </div>
        </section>

        {/* ============ INDUSTRIES ============ */}
        <section id="industries" className="py-24 px-6 border-t border-border">
          <div className="max-w-7xl mx-auto">
            <Reveal>
              <div className="text-center mb-16">
                <div className="text-xs font-mono tracking-widest text-brand-cyan uppercase mb-3">BUILT FOR</div>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                  Every project-driven industry
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  If your business runs on projects with milestones, billing, and compliance — SYNLUMEX adapts.
                </p>
              </div>
            </Reveal>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { icon: HardHat, title: 'EPC & Construction', body: 'Multiplex, thermal, industrial plants — from small to multi-billion portfolios.' },
                { icon: Zap, title: 'Energy & Utilities', body: 'Solar, wind, transmission. Capital projects with high overrun risk.' },
                { icon: Factory, title: 'Manufacturing', body: 'Plant upgrades, capacity expansions, multi-vendor coordination.' },
                { icon: Droplet, title: 'Oil & Gas', body: 'Refineries, pipelines, LNG. Complex compliance, tight margins.' },
                { icon: Truck, title: 'Logistics & Infrastructure', body: 'Ports, rail, highways. Multi-stakeholder, multi-year coordination.' },
                { icon: Pickaxe, title: 'Mining & Metals', body: 'Multi-billion dollar capital projects. Chronic delays, budget drift.' }
              ].map((item, i) => (
                <Reveal key={i} delay={((i % 3) * 100) as 0 | 100 | 200}>
                  <div className="group rounded-lg border border-border bg-card p-5 hover-lift card-glow">
                    <div className="h-10 w-10 rounded-md brand-gradient flex items-center justify-center mb-3">
                      <item.icon className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="font-semibold mb-1.5 text-sm">{item.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{item.body}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ============ PRICING ============ */}
        <section id="pricing" className="py-24 px-6 bg-secondary/30">
          <div className="max-w-6xl mx-auto">
            <Reveal>
              <div className="text-center mb-10">
                <div className="text-xs font-mono tracking-widest text-brand-cyan uppercase mb-3">PRICING</div>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Simple pricing. Serious ROI.</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  All plans include the AI intelligence layer, historical insights, and audit logs.
                </p>
              </div>
            </Reveal>

            <Reveal>
              <div className="flex justify-center mb-10">
                <div className="inline-flex items-center rounded-full border border-border bg-card p-1">
                  <button
                    onClick={() => setBillingCycle('monthly')}
                    className={`px-5 py-2 text-xs font-mono tracking-wider rounded-full transition-all ${
                      billingCycle === 'monthly'
                        ? 'brand-gradient text-white'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    MONTHLY
                  </button>
                  <button
                    onClick={() => setBillingCycle('yearly')}
                    className={`px-5 py-2 text-xs font-mono tracking-wider rounded-full transition-all flex items-center gap-2 ${
                      billingCycle === 'yearly'
                        ? 'brand-gradient text-white'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    YEARLY
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded ${
                        billingCycle === 'yearly'
                          ? 'bg-white/20 text-white'
                          : 'bg-emerald-500/10 text-emerald-600'
                      }`}
                    >
                      SAVE 17%
                    </span>
                  </button>
                </div>
              </div>
            </Reveal>

            <div className="grid md:grid-cols-3 gap-6">
              {pricing.map((tier, i) => {
                const price = billingCycle === 'monthly' ? tier.monthly : tier.yearly / 12;
                return (
                  <Reveal key={i} delay={(i * 100) as 0 | 100 | 200}>
                    <div
                      className={`rounded-xl border p-6 relative hover-lift ${
                        tier.highlight
                          ? 'border-brand-cyan/60 bg-white shadow-xl shadow-brand/10'
                          : 'border-border bg-card card-glow'
                      }`}
                    >
                      {tier.highlight && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full brand-gradient text-white px-3 py-1 text-[10px] font-mono tracking-widest uppercase">
                          MOST POPULAR
                        </div>
                      )}
                      <h3 className="text-lg font-bold mb-1">{tier.name}</h3>
                      <p className="text-xs text-muted-foreground mb-5">{tier.tagline}</p>
                      <div className="mb-1">
                        <span className="text-[10px] font-mono tracking-widest text-muted-foreground uppercase">
                          Starting at
                        </span>
                      </div>
                      <div className="mb-1 flex items-baseline gap-2">
                        <span className="text-4xl font-bold brand-gradient-text">
                          ${Math.round(price).toLocaleString()}
                        </span>
                        <span className="text-sm text-muted-foreground">/ month</span>
                      </div>
                      {billingCycle === 'yearly' && (
                        <div className="text-[10px] font-mono text-muted-foreground mb-4">
                          Billed ${Math.round(tier.yearly).toLocaleString()} annually
                        </div>
                      )}
                      <ul className="space-y-2.5 mb-6 mt-4">
                        {tier.features.map((f, j) => (
                          <li key={j} className="flex items-start gap-2 text-sm">
                            <Check className="h-4 w-4 text-brand-cyan shrink-0 mt-0.5" />
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                      <a
                        href={WHATSAPP_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`group block w-full rounded-md px-4 py-2.5 text-sm font-medium text-center transition-all ${
                          tier.highlight
                            ? 'brand-gradient text-white btn-primary'
                            : 'border border-border hover:bg-accent'
                        }`}
                      >
                        {tier.cta}
                      </a>
                    </div>
                  </Reveal>
                );
              })}
            </div>

            <div className="mt-10 text-center text-xs text-muted-foreground font-mono">
              All prices in USD · Annual billing saves 17% · Enterprise plans can be invoiced
            </div>
          </div>
        </section>

        {/* ============ FAQ ============ */}
        <section id="faq" className="py-24 px-6 border-t border-border">
          <div className="max-w-3xl mx-auto">
            <Reveal>
              <div className="text-center mb-12">
                <div className="text-xs font-mono tracking-widest text-brand-cyan uppercase mb-3">FAQ</div>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Common questions</h2>
              </div>
            </Reveal>

            <div className="space-y-3">
              {[
                { q: 'What is an operating system for project businesses?', a: 'A software platform built for the people running projects — owners, project directors, and finance teams. It connects intake, execution, billing, and compliance in one closed loop, giving visibility that ERP and PM tools cannot provide.' },
                { q: 'How is this different from Procore or Autodesk?', a: 'Procore and Autodesk manage project execution — tasks, drawings, schedules. SYNLUMEX connects execution → billing → compliance → intelligence. You get end-to-end visibility across the full lifecycle.' },
                { q: 'Do I need to replace my ERP?', a: 'No. SYNLUMEX sits above your ERP. It reads data from your systems, connects the gaps between them, and gives you visibility ERP alone cannot provide.' },
                { q: 'Is my data safe?', a: 'Yes. Multi-tenant architecture with database-level row-level security. Your project data is isolated from every other organization. Our support team cannot see your data unless you explicitly authorize impersonation for a support session.' },
                { q: 'How does the AI work?', a: 'We use multiple providers (Groq, Cerebras, OpenRouter, Google Gemini) with automatic failover. Your project data is never used to train AI models. AI output is always reviewed by your team before action.' },
                { q: 'Can I try before paying?', a: 'Yes — 14-day trial on the Pro plan. No credit card required. Book a demo and we will set up your workspace manually.' },
                { q: 'Do you offer custom deployments?', a: 'Yes. Enterprise plans include SSO/SAML, custom SLAs, dedicated support, and optional on-premise deployment.' },
                { q: 'Which industries do you support?', a: 'Any project-driven industry. We are strongest in EPC and construction, energy and utilities, manufacturing, oil and gas, logistics and infrastructure, and mining.' }
              ].map((item, i) => (
                <Reveal key={i} delay={0}>
                  <details className="group rounded-lg border border-border bg-card overflow-hidden hover:border-brand-cyan/30 transition-colors card-glow">
                    <summary className="cursor-pointer p-4 font-medium text-sm flex items-center justify-between hover:bg-secondary/50 transition-colors list-none">
                      {item.q}
                      <ArrowRight className="h-4 w-4 text-muted-foreground group-open:rotate-90 transition-transform shrink-0 ml-2" />
                    </summary>
                    <div className="px-4 pb-4 text-sm text-muted-foreground leading-relaxed">{item.a}</div>
                  </details>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ============ FINAL CTA ============ */}
        <section className="py-24 px-6 bg-secondary/30 relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-cyan/10 rounded-full blur-3xl pointer-events-none" />
          <div className="max-w-3xl mx-auto text-center relative">
            <Reveal>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
                Ready to see it in action?
              </h2>
            </Reveal>
            <Reveal delay={100}>
              <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                15-minute walkthrough. No sales pitch. See your workflows mapped onto SYNLUMEX.
              </p>
            </Reveal>
            <Reveal delay={200}>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group rounded-md brand-gradient-animated text-white px-6 py-3 text-sm font-semibold btn-primary flex items-center gap-2"
                >
                  <MessageCircle className="h-4 w-4" /> WhatsApp us now
                </a>
                <a
                  href="mailto:abdul@synlumexai.com"
                  className="rounded-md border border-border bg-card px-6 py-3 text-sm font-medium hover:bg-secondary transition-colors"
                >
                  abdul@synlumexai.com
                </a>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ============ FOOTER ============ */}
        <footer className="border-t border-border py-12 px-6 bg-background">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8 mb-8">
              <div>
                <Link href="/" className="group inline-flex items-center mb-4" aria-label="SYNLUMEX home">
                  <Logo size={28} interactive />
                </Link>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Operating system for project-driven businesses. Intake to closeout. Execution to money.
                </p>
              </div>

              <div>
                <div className="text-xs font-mono tracking-widest text-muted-foreground uppercase mb-3">Product</div>
                <ul className="space-y-2 text-sm">
                  <li><a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Features</a></li>
                  <li><a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">Pricing</a></li>
                  <li><a href="#industries" className="text-muted-foreground hover:text-foreground transition-colors">Industries</a></li>
                  <li><Link href="/login" className="text-muted-foreground hover:text-foreground transition-colors">Sign in</Link></li>
                </ul>
              </div>

              <div>
                <div className="text-xs font-mono tracking-widest text-muted-foreground uppercase mb-3">Company</div>
                <ul className="space-y-2 text-sm">
                  <li><Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">About</Link></li>
                  <li><Link href="/contact" className="text-muted-foreground hover:text-foreground transition-colors">Contact</Link></li>
                  <li><Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">Privacy</Link></li>
                  <li><Link href="/terms" className="text-muted-foreground hover:text-foreground transition-colors">Terms</Link></li>
                </ul>
              </div>

              <div>
                <div className="text-xs font-mono tracking-widest text-muted-foreground uppercase mb-3">Contact</div>
                <ul className="space-y-2 text-sm">
                  <li>
                    <a
                      href={WHATSAPP_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
                    >
                      <MessageCircle className="h-3.5 w-3.5" /> WhatsApp
                    </a>
                  </li>
                  <li>
                    <a href="mailto:abdul@synlumexai.com" className="text-muted-foreground hover:text-foreground transition-colors">
                      abdul@synlumexai.com
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-3">
              <div className="text-xs text-muted-foreground font-mono">© 2026 SYNLUMEX</div>
              <div className="text-xs text-muted-foreground font-mono flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                All systems operational
              </div>
            </div>
          </div>
        </footer>
      </div>

      <ContactFab />
    </>
  );
}
