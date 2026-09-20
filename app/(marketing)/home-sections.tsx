'use client';

import {
  LayoutGrid, FolderKanban, AlertTriangle, Banknote, Sparkles, Bell,
  ArrowRight, Check, ShieldCheck, Zap, Target, TrendingUp, Users,
  Building2, HardHat, Factory, Truck, MessageCircle, Play,
  BarChart3, Lock, Clock, Brain
} from 'lucide-react';

export function HomeSections() {
  return (
    <>
      {/* ============ HERO ============ */}
      <section className="pt-24 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-cyan/30 bg-brand-cyan/5 px-3 py-1 text-xs font-mono tracking-wider text-brand-cyan mb-6">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-cyan animate-pulse" />
            OWNER-SIDE PROJECT OPERATING SYSTEM
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.05] mb-6">
            Run every project
            <br />
            <span className="brand-gradient-text">from intake to closeout</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-10 leading-relaxed">
            SYNLUMEX INTEL connects your project lifecycle — requirements, execution,
            billing, and compliance — into one closed-loop system. Every department updates
            once. Every impact is visible. Nothing falls through the cracks.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-16">
            <a
              href="https://wa.me/919999999999?text=Hi%2C%20I%27d%20like%20a%20SYNLUMEX%20demo"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md brand-gradient text-white px-6 py-3 text-sm font-semibold hover:opacity-90 transition-opacity flex items-center gap-2"
            >
              Book a 15-min demo <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="#screenshot"
              className="rounded-md border border-border bg-card px-6 py-3 text-sm font-medium hover:bg-accent transition-colors flex items-center gap-2"
            >
              <Play className="h-4 w-4" /> See it in action
            </a>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-mono text-muted-foreground">
            <div className="flex items-center gap-2"><Lock className="h-3.5 w-3.5" /> SOC 2 ready</div>
            <div className="flex items-center gap-2"><Clock className="h-3.5 w-3.5" /> 14-day trial</div>
            <div className="flex items-center gap-2"><Users className="h-3.5 w-3.5" /> Multi-tenant</div>
            <div className="flex items-center gap-2"><Zap className="h-3.5 w-3.5" /> AI-powered</div>
          </div>
        </div>
      </section>

      {/* ============ HERO SCREENSHOT ============ */}
      <section id="screenshot" className="pb-24 px-6">
        <div className="max-w-6xl mx-auto">
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
        </div>
      </section>

      {/* ============ THE PROBLEM ============ */}
      <section className="py-24 px-6 border-t border-border">
        <div className="max-w-7xl mx-auto">
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

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: AlertTriangle, title: 'Handoffs get lost', body: 'Change orders sit in email. Approvals wait for signatures. Billing gets delayed. Nobody knows where work is stuck.' },
              { icon: Banknote, title: 'Margin dies invisibly', body: "You know what you billed. You don't know what's stuck between execution and collection. Unbilled revenue is invisible." },
              { icon: Brain, title: 'Knowledge walks away', body: 'When your best project manager leaves, the process leaves with them. Six months later, you repeat the same mistakes.' }
            ].map((item, i) => (
              <div key={i} className="rounded-lg border border-border bg-card/50 p-6">
                <div className="h-10 w-10 rounded-md bg-destructive/10 border border-destructive/30 flex items-center justify-center mb-4">
                  <item.icon className="h-5 w-5 text-destructive" />
                </div>
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ THE SOLUTION ============ */}
      <section className="py-24 px-6 bg-gradient-to-b from-background to-card/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="text-xs font-mono tracking-widest text-brand-cyan uppercase mb-3">THE SOLUTION</div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              One operating system. Every handoff closed.
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              SYNLUMEX INTEL connects intake → execution → money → intelligence in a single
              closed loop. Each update propagates. Each impact is visible. Each exception is owned.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Target, step: '01', title: 'Intake to Execution', body: 'Structured lifecycle from requirements through 14 stages to closeout. Every stage has owners, gates, and evidence.', features: ['14-stage lifecycle', 'BOQ intelligence', 'AI extraction from PDF'] },
              { icon: TrendingUp, step: '02', title: 'Execution to Money', body: 'Progress, billing, and collection — all connected. See unbilled revenue, collection efficiency, and cash gaps in real time.', features: ['Commercial visibility', 'Unbilled revenue tracking', 'Risk scoring'] },
              { icon: Sparkles, step: '03', title: 'Intelligence Layer', body: 'Every mutation triggers recompute. Exceptions auto-created. Historical patterns compound. The system gets smarter over time.', features: ['Auto-flagged exceptions', 'AI risk analysis', 'Historical intelligence'] }
            ].map((item, i) => (
              <div key={i} className="rounded-lg border border-border bg-card/50 p-6 relative overflow-hidden">
                <div className="absolute top-4 right-4 text-6xl font-bold text-muted/20 font-mono">{item.step}</div>
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
            ))}
          </div>
        </div>
      </section>

      {/* ============ FEATURES GRID ============ */}
      <section id="features" className="py-24 px-6 border-t border-border">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="text-xs font-mono tracking-widest text-brand-cyan uppercase mb-3">CAPABILITIES</div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Everything an owner needs in one console
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: LayoutGrid, title: 'Owner Command Center', body: 'Real-time portfolio KPIs — value, health, cash flow, exceptions.' },
              { icon: FolderKanban, title: '14-Stage Lifecycle', body: 'From intake to closeout. Each stage has owners, gates, and evidence.' },
              { icon: Banknote, title: 'Commercial Visibility', body: 'Execution vs billing vs collection. Unbilled revenue surfaced.' },
              { icon: AlertTriangle, title: 'Exception Engine', body: 'Auto-flags delays, overruns, collection gaps. Assigns owners.' },
              { icon: Sparkles, title: 'AI BOQ Extraction', body: 'Upload PDF or paste text. AI extracts structured line items.' },
              { icon: Brain, title: 'AI Risk Analysis', body: 'Reads project state and writes executive risk bullets.' },
              { icon: Bell, title: 'Smart Reminders', body: 'Every exception creates a tracked reminder with an owner.' },
              { icon: BarChart3, title: 'Historical Intelligence', body: 'Avg durations, delay causes, drop-off stages — compounding.' },
              { icon: ShieldCheck, title: 'Audit Trail', body: 'Every mutation logged. Every action provable. Every change tracked.' }
            ].map((item, i) => (
              <div key={i} className="rounded-lg border border-border bg-card/50 p-5 hover:border-brand-cyan/40 transition-colors group">
                <div className="h-9 w-9 rounded-md bg-brand/10 border border-brand/30 flex items-center justify-center mb-3 group-hover:brand-gradient transition-all">
                  <item.icon className="h-4 w-4 text-brand-cyan group-hover:text-white transition-colors" />
                </div>
                <h3 className="font-semibold mb-1.5 text-sm">{item.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ THE LOOP ============ */}
      <section className="py-24 px-6 bg-card/30 border-t border-border">
        <div className="max-w-5xl mx-auto text-center">
          <div className="text-xs font-mono tracking-widest text-brand-cyan uppercase mb-3">THE CLOSED LOOP</div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Update once. Impact everywhere.
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-12">
            Most tools stop at record-keeping. SYNLUMEX runs The Loop —
            every update triggers recompute, exceptions, and reminders automatically.
          </p>

          <div className="rounded-lg border border-border bg-background p-8 text-left font-mono text-xs space-y-3">
            <div className="flex items-start gap-3"><div className="text-brand-cyan shrink-0">01 →</div><div><span className="text-foreground font-semibold">Anyone updates</span> <span className="text-muted-foreground">— site engineer marks progress, finance records billing, PM changes stage</span></div></div>
            <div className="flex items-start gap-3"><div className="text-brand-cyan shrink-0">02 →</div><div><span className="text-foreground font-semibold">System recomputes</span> <span className="text-muted-foreground">— project health recalculated against rules</span></div></div>
            <div className="flex items-start gap-3"><div className="text-brand-cyan shrink-0">03 →</div><div><span className="text-foreground font-semibold">Exceptions auto-created</span> <span className="text-muted-foreground">— delayed, overrun, missing evidence, collection gap</span></div></div>
            <div className="flex items-start gap-3"><div className="text-brand-cyan shrink-0">04 →</div><div><span className="text-foreground font-semibold">Owners notified</span> <span className="text-muted-foreground">— reminder to the person accountable</span></div></div>
            <div className="flex items-start gap-3"><div className="text-brand-cyan shrink-0">05 →</div><div><span className="text-foreground font-semibold">Audit logged</span> <span className="text-muted-foreground">— immutable record of every action and impact</span></div></div>
            <div className="flex items-start gap-3"><div className="text-brand-cyan shrink-0">06 →</div><div><span className="text-foreground font-semibold">Intelligence compounds</span> <span className="text-muted-foreground">— patterns feed back into the next project</span></div></div>
          </div>
        </div>
      </section>

      {/* ============ INDUSTRIES ============ */}
      <section id="industries" className="py-24 px-6 border-t border-border">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="text-xs font-mono tracking-widest text-brand-cyan uppercase mb-3">BUILT FOR</div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Any project-driven industry
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              If your business runs on projects with milestones, billing, and compliance — SYNLUMEX adapts.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-4">
            {[
              { icon: HardHat, title: 'EPC & Construction', body: 'Multiplex, thermal, infrastructure, industrial plants' },
              { icon: Factory, title: 'Manufacturing', body: 'Plant upgrades, expansion projects, capex programs' },
              { icon: Truck, title: 'Logistics & Infrastructure', body: 'Ports, rail, highways, warehousing' },
              { icon: Building2, title: 'Energy & Utilities', body: 'Solar, wind, power transmission, water treatment' }
            ].map((item, i) => (
              <div key={i} className="rounded-lg border border-border bg-card/50 p-5 text-center">
                <div className="h-10 w-10 rounded-md brand-gradient flex items-center justify-center mx-auto mb-3">
                  <item.icon className="h-5 w-5 text-white" />
                </div>
                <h3 className="font-semibold mb-1.5 text-sm">{item.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ PRICING ============ */}
      <section id="pricing" className="py-24 px-6 bg-card/30 border-t border-border">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="text-xs font-mono tracking-widest text-brand-cyan uppercase mb-3">PRICING</div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Simple pricing. Serious ROI.
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Every plan includes the AI intelligence layer, historical insights, and audit logs.
              No hidden fees. Cancel anytime.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: 'Starter', price: '₹4,999', tagline: 'For small teams getting started', features: ['10 projects', '3 team members', '100 AI extractions/month', 'Core dashboards', 'Email support'], highlight: false, cta: 'Start free trial' },
              { name: 'Pro', price: '₹14,999', tagline: 'For growing EPC contractors', features: ['100 projects', '15 team members', '1,000 AI extractions/month', 'Historical intelligence', 'Priority support', 'Custom domains'], highlight: true, cta: 'Start free trial' },
              { name: 'Enterprise', price: '₹49,999', tagline: 'For large portfolio owners', features: ['Unlimited projects', 'Unlimited users', 'Unlimited AI extractions', 'Full API access', 'SSO / SAML', 'Dedicated support', 'Custom SLA'], highlight: false, cta: 'Talk to sales' }
            ].map((tier, i) => (
              <div key={i} className={`rounded-xl border p-6 relative ${tier.highlight ? 'border-brand-cyan/50 bg-gradient-to-br from-brand/10 to-transparent' : 'border-border bg-card/50'}`}>
                {tier.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full brand-gradient text-white px-3 py-1 text-[10px] font-mono tracking-widest uppercase">
                    MOST POPULAR
                  </div>
                )}
                <h3 className="text-lg font-bold mb-1">{tier.name}</h3>
                <p className="text-xs text-muted-foreground mb-5">{tier.tagline}</p>
                <div className="mb-6">
                  <span className="text-3xl font-bold brand-gradient-text">{tier.price}</span>
                  <span className="text-sm text-muted-foreground ml-1">/ month</span>
                </div>
                <ul className="space-y-2.5 mb-6">
                  {tier.features.map((f, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-brand-cyan shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <a
                  href="https://wa.me/919999999999?text=Hi%2C%20I%27d%20like%20to%20start%20the%20SYNLUMEX%20trial"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`block w-full rounded-md px-4 py-2.5 text-sm font-medium text-center transition-opacity ${tier.highlight ? 'brand-gradient text-white hover:opacity-90' : 'border border-border hover:bg-accent'}`}
                >
                  {tier.cta}
                </a>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center text-xs text-muted-foreground">
            All prices in INR · Annual billing saves 17% · Enterprise plans can be invoiced
          </div>
        </div>
      </section>

      {/* ============ FAQ ============ */}
      <section id="faq" className="py-24 px-6 border-t border-border">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <div className="text-xs font-mono tracking-widest text-brand-cyan uppercase mb-3">FAQ</div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Common questions</h2>
          </div>

          <div className="space-y-3">
            {[
              { q: 'How is this different from Procore or Autodesk?', a: "Those tools manage project execution. We connect execution → billing → compliance → intelligence. You get owner-side visibility that ERP tools can't give you." },
              { q: 'Do I need to replace my ERP?', a: "No. SYNLUMEX sits above your ERP. We read from it, connect the gaps between systems, and give you visibility ERP can't provide." },
              { q: 'Is my data safe?', a: 'Yes. Multi-tenant architecture with database-level row-level security. Your projects are isolated. Even our support team can\'t see your data unless you authorize it.' },
              { q: 'How does the AI work?', a: 'We use multiple providers (Groq, Cerebras, OpenRouter, Gemini) with automatic failover. Your data is never used for training. AI only extracts and analyses — you always make the call.' },
              { q: 'Can I try before paying?', a: 'Yes — 14-day trial on Pro. No credit card required. Just book a demo and we\'ll set you up.' },
              { q: 'Do you offer custom deployments?', a: 'Yes. Enterprise plan includes SSO, custom SLAs, dedicated support, and optional on-prem. Talk to us.' }
            ].map((item, i) => (
              <details key={i} className="group rounded-lg border border-border bg-card/50 overflow-hidden">
                <summary className="cursor-pointer p-4 font-medium text-sm flex items-center justify-between hover:bg-accent/30 transition-colors list-none">
                  {item.q}
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-open:rotate-90 transition-transform" />
                </summary>
                <div className="px-4 pb-4 text-sm text-muted-foreground leading-relaxed">{item.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ============ FINAL CTA ============ */}
      <section className="py-24 px-6 border-t border-border relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-20" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-cyan/20 rounded-full blur-3xl" />
        <div className="max-w-3xl mx-auto text-center relative">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
            Ready to see it in action?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            15-minute walkthrough. No sales pitch. See your own workflows mapped onto SYNLUMEX in real time.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="https://wa.me/919999999999?text=Hi%2C%20I%27d%20like%20a%20SYNLUMEX%20demo"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md brand-gradient text-white px-6 py-3 text-sm font-semibold hover:opacity-90 transition-opacity flex items-center gap-2"
            >
              <MessageCircle className="h-4 w-4" /> WhatsApp us now
            </a>
            <a
              href="mailto:support@synlumex.ai"
              className="rounded-md border border-border bg-card px-6 py-3 text-sm font-medium hover:bg-accent transition-colors"
            >
              support@synlumex.ai
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
