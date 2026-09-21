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

const CONTEXT = `You are Intel AI, the website assistant for SYNLUMEX INTEL — an operating system for project-driven businesses.

Answer questions using ONLY the facts below. If a question is not covered, respond with: "Let me connect you with our team — please message us on WhatsApp at +91 93907 85041." Do not invent features, prices, or capabilities. Be concise (1-3 sentences) and warm.

POSITIONING: Operating system for project-driven businesses. Connects intake, execution, billing, and compliance into one closed loop.
TAGLINE: Manage projects, money, and compliance in one place.
BUYERS: Owners, project directors, and finance teams.

PRICING (USD):
- Starter: $1,499/month. 25 projects, 5 users, 250 AI extractions/month.
- Pro (MOST POPULAR): $3,999/month. 250 projects, 25 users, 2,500 AI extractions/month.
- Enterprise: $9,999/month. 1,000 projects, 100 users, 25,000 AI extractions/month.
Annual saves 17%. 14-day trial on Pro. No credit card.

INDUSTRIES: EPC & Construction, Energy & Utilities, Manufacturing, Oil & Gas, Logistics & Infrastructure, Mining & Metals.

CAPABILITIES: Owner Command Center, 14-Stage Lifecycle, Commercial Visibility, Exception Engine, AI BOQ Extraction, AI Risk Analysis, Smart Reminders, Historical Intelligence, Audit Trail.

THE LOOP: Every update triggers automatic recompute of health, exceptions, notifications, and audit logging.

FAQ:
- What is SYNLUMEX? A software platform for people running projects. Connects intake, execution, billing, and compliance in one closed loop.
- Different from Procore/Autodesk? They manage execution. SYNLUMEX connects execution → billing → compliance → intelligence.
- Replace my ERP? No. SYNLUMEX sits above the ERP, connecting gaps.
- Is my data safe? Yes. Multi-tenant with database-level row-level security.
- How does AI work? Multi-provider with failover. Data never used for training.
- Try before paying? Yes — 14-day trial on Pro. No credit card.
- Custom deployments? Yes on Enterprise: SSO/SAML, custom SLA, on-prem.

CONTACT: WhatsApp +91 93907 85041. Email abdul@synlumexai.com.

If asked who you are: "I'm Intel AI, SYNLUMEX's website assistant."`;

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
    m.includes('overloaded') ||
    m.includes('decommissioned')
  );
}

async function callWithFallback(userPrompt: string): Promise<string> {
  let lastError: any = null;

  for (const p of PROVIDERS) {
    if (!p.apiKey) continue;
    const client = new OpenAI({ apiKey: p.apiKey, baseURL: p.baseURL });
    for (const model of p.models) {
      try {
        const res = await client.chat.completions.create({
          model,
          messages: [{ role: 'user', content: userPrompt }]
        });
        const content = res.choices?.[0]?.message?.content;
        if (content) {
          console.log(`[Intel AI] ${p.name}/${model} OK`);
          return content;
        }
      } catch (e: any) {
        const status = e?.status ?? e?.response?.status;
        const msg = String(e?.message ?? '');
        lastError = e;
        console.warn(`[Intel AI] ${p.name}/${model} FAIL (${status}): ${msg.slice(0, 150)}`);
        if (isRetryable(status, msg)) continue;
        throw e;
      }
    }
  }
  throw lastError ?? new Error('All providers failed');
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const message = String(body?.message ?? '').trim();
    const history = Array.isArray(body?.history) ? body.history : [];

    if (!message) {
      return NextResponse.json({ error: 'Message required' }, { status: 400 });
    }

    const conversation = history
      .slice(-6)
      .map((h: any) => `${h.role === 'user' ? 'Visitor' : 'Intel AI'}: ${h.content}`)
      .join('\n');

    const prompt = `${CONTEXT}

---
Previous conversation:
${conversation || '(none)'}

Visitor: ${message}

Intel AI:`;

    const reply = await callWithFallback(prompt);
    return NextResponse.json({ reply: reply.trim() });
  } catch (e: any) {
    console.error('[Intel AI] fatal:', e?.message ?? e);
    return NextResponse.json(
      {
        reply:
          "I'm having trouble right now. Please reach us on WhatsApp at +91 93907 85041 and our team will help."
      },
      { status: 200 }
    );
  }
}
