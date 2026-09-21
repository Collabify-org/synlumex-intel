import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export const runtime = 'nodejs';
export const maxDuration = 60;

const PROVIDERS = [
  {
    name: 'groq',
    baseURL: 'https://api.groq.com/openai/v1',
    apiKey: process.env.GROQ_API_KEY,
    models: ['openai/gpt-oss-120b', 'openai/gpt-oss-20b', 'groq/compound-mini']
  },
  {
    name: 'cerebras',
    baseURL: 'https://api.cerebras.ai/v1',
    apiKey: process.env.CEREBRAS_API_KEY,
    models: ['llama-3.3-70b', 'llama3.1-8b']
  },
  {
    name: 'openrouter',
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: process.env.OPENROUTER_API_KEY,
    models: [
      'meta-llama/llama-3.3-70b-instruct:free',
      'google/gemini-2.0-flash-exp:free'
    ]
  }
];

const WEBSITE_CONTEXT = `
SYNLUMEX INTEL — Official Information for Intel AI

POSITIONING
SYNLUMEX INTEL is an operating system for project-driven businesses. It connects intake, execution, billing, and compliance into one closed loop. Tagline: "Manage projects, money, and compliance in one place. You don't lose on the project. You lose on what happens between stages."

WHO IT'S FOR
Owners, project directors, and finance teams at project-driven businesses.

PRICING (all USD)
- Starter: Starting at $1,499/month. 25 projects, 5 team members, 250 AI extractions/month, Owner Command Center, Exception engine, Email support.
- Pro (MOST POPULAR): Starting at $3,999/month. 250 projects, 25 team members, 2,500 AI extractions/month, Historical intelligence, Predictive risk flags, Priority support, Custom domains, Unbilled revenue tracking.
- Enterprise: Starting at $9,999/month. 1,000 projects, 100 team members, 25,000 AI extractions/month, Full API access, SSO/SAML, Dedicated support, Custom SLA, On-premise deployment option.
- Annual billing saves 17%.
- 14-day trial on Pro. No credit card required.

INDUSTRIES SERVED
EPC & Construction, Energy & Utilities, Manufacturing, Oil & Gas, Logistics & Infrastructure, Mining & Metals.

CORE CAPABILITIES
- Owner Command Center: Real-time portfolio KPIs — value, health, cash flow, exceptions.
- 14-Stage Lifecycle: From intake to closeout. Each stage has owners, gates, and evidence.
- Commercial Visibility: Execution vs billing vs collection. Unbilled revenue surfaced.
- Exception Engine: Auto-flags delays, overruns, collection gaps. Assigns owners.
- AI BOQ Extraction: Upload PDF or paste text. AI extracts structured line items.
- AI Risk Analysis: Reads project state and writes executive risk bullets.
- Smart Reminders: Every exception creates a tracked reminder with an owner.
- Historical Intelligence: Avg durations, delay causes, drop-off stages — compounding.
- Audit Trail: Every mutation logged. Every action provable.

THE LOOP (unique differentiator)
Every update triggers automatic recompute of project health, creation of exceptions, notification of owners, and immutable audit logging. Most tools stop at record-keeping. SYNLUMEX runs The Loop.

THE 7 FLOWS WHERE PROJECTS BLEED (pain points we solve)
1. Cash flow vs. progress disconnect (15-30 days of stuck working capital)
2. Design changes cascade (avg 10-20% cost overrun per change)
3. Procurement delays compound (weeks of catch-up avoided)
4. Labour shortage stretches timelines (3-6 months of delay per event)
5. Statutory approval bottlenecks (direct cost + opportunity loss)
6. Rework from upstream factors (5-6% of contract value wasted)
7. Information lag between field and office (owners see reality weeks later)

FAQ
Q: What is an operating system for project businesses?
A: A software platform built for the people running projects — owners, project directors, and finance teams. It connects intake, execution, billing, and compliance in one closed loop.

Q: How is this different from Procore or Autodesk?
A: Procore and Autodesk manage project execution. SYNLUMEX connects execution → billing → compliance → intelligence. End-to-end visibility across the full lifecycle.

Q: Do I need to replace my ERP?
A: No. SYNLUMEX sits above your ERP. It reads data from your systems, connects the gaps, and gives you visibility ERP alone cannot.

Q: Is my data safe?
A: Yes. Multi-tenant architecture with database-level row-level security. Your project data is isolated. Support team cannot see your data unless you explicitly authorize impersonation for support.

Q: How does the AI work?
A: Multiple providers (Groq, Cerebras, OpenRouter, Google Gemini) with automatic failover. Your project data is never used to train AI models.

Q: Can I try before paying?
A: Yes — 14-day trial on Pro. No credit card required. Book a demo to get set up.

Q: Do you offer custom deployments?
A: Yes. Enterprise plans include SSO/SAML, custom SLAs, dedicated support, and optional on-premise.

CONTACT
- WhatsApp: +91 93907 85041
- Email: abdul@synlumexai.com
- Website: synlumex-intel.vercel.app
- To book a demo: click "Book a demo" or reach via WhatsApp.

RULES FOR YOU (Intel AI)
- Answer ONLY using the information above. Do not invent features, prices, or capabilities.
- Be concise: 1-3 sentences per answer unless a list is required.
- If the question is about a specific price, feature, or integration not in the context, say: "Let me connect you with our team — please message us on WhatsApp at +91 93907 85041."
- Never promise anything not explicitly in this context.
- Be warm and professional. You represent SYNLUMEX.
- If asked who you are: "I'm Intel AI, SYNLUMEX's website assistant. I can answer questions about pricing, features, industries, and how it works."
`;

function isRetryable(status: number | undefined, message: string): boolean {
  if ([400, 401, 402, 403, 404, 408, 422, 429, 500, 502, 503, 504].includes(status ?? 0)) return true;
  const m = message.toLowerCase();
  return (
    m.includes('does not exist') ||
    m.includes('not found') ||
    m.includes('no access') ||
    m.includes('rate limit') ||
    m.includes('quota') ||
    m.includes('unavailable') ||
    m.includes('overloaded')
  );
}

async function callWithFallback(messages: any[]): Promise<string> {
  let lastError: any = null;

  for (const p of PROVIDERS) {
    if (!p.apiKey) continue;
    const client = new OpenAI({ apiKey: p.apiKey, baseURL: p.baseURL });
    for (const model of p.models) {
      try {
        const res = await client.chat.completions.create({
          model,
          messages,
          temperature: 0.4,
          max_tokens: 500
        });
        const content = res.choices?.[0]?.message?.content;
        if (content) return content;
      } catch (e: any) {
        const status = e?.status ?? e?.response?.status;
        const msg = String(e?.message ?? '');
        lastError = e;
        if (isRetryable(status, msg)) continue;
        throw e;
      }
    }
  }
  throw lastError ?? new Error('All AI providers failed');
}

export async function POST(req: Request) {
  try {
    const { message, history } = await req.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message required' }, { status: 400 });
    }

    const messages: any[] = [
      { role: 'system', content: WEBSITE_CONTEXT },
      ...(Array.isArray(history) ? history.slice(-6) : []),
      { role: 'user', content: message }
    ];

    const reply = await callWithFallback(messages);
    return NextResponse.json({ reply });
  } catch (e: any) {
    return NextResponse.json(
      {
        reply:
          "I'm having trouble right now. Please reach us on WhatsApp at +91 93907 85041 and our team will help."
      },
      { status: 200 }
    );
  }
}
