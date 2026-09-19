// ============================================================
// Unified AI Provider — Waterfall Fallback
// Order: Groq → Cerebras → SambaNova → Gemini
// ============================================================

import OpenAI from 'openai';

type Provider = {
  name: string;
  baseURL: string;
  apiKey: string | undefined;
  models: string[];
};

const PROVIDERS: Provider[] = [
  {
    name: 'groq',
    baseURL: 'https://api.groq.com/openai/v1',
    apiKey: process.env.GROQ_API_KEY,
    models: [
      'llama-3.1-8b-instant',
      'llama-3.3-70b-versatile',
      'llama-3.1-70b-versatile'
    ]
  },
  {
    name: 'cerebras',
    baseURL: 'https://api.cerebras.ai/v1',
    apiKey: process.env.CEREBRAS_API_KEY,
    models: ['llama3.1-8b', 'llama3.3-70b']
  },
  {
    name: 'sambanova',
    baseURL: 'https://api.sambanova.ai/v1',
    apiKey: process.env.SAMBANOVA_API_KEY,
    models: ['Meta-Llama-3.1-8B-Instruct', 'Meta-Llama-3.3-70B-Instruct']
  }
];

function isRetryable(status: number | undefined, message: string): boolean {
  if ([400, 401, 403, 404, 422, 429, 500, 502, 503, 504].includes(status ?? 0)) return true;
  const m = message.toLowerCase();
  return (
    m.includes('does not exist') ||
    m.includes('not found') ||
    m.includes('no access') ||
    m.includes('decommissioned') ||
    m.includes('deprecated') ||
    m.includes('rate limit')
  );
}

async function callOpenAICompatible(prompt: string, jsonMode: boolean): Promise<string> {
  let lastError: any = null;
  for (const p of PROVIDERS) {
    if (!p.apiKey) continue;
    const client = new OpenAI({ apiKey: p.apiKey, baseURL: p.baseURL });
    for (const model of p.models) {
      try {
        const res = await client.chat.completions.create({
          model,
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.2,
          max_tokens: 4096,
          ...(jsonMode ? { response_format: { type: 'json_object' } } : {})
        });
        const content = res.choices?.[0]?.message?.content;
        if (content) {
          console.log(`[AI] ${p.name}/${model} ok`);
          return content;
        }
        lastError = new Error(`${p.name}/${model} empty`);
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

async function callGemini(prompt: string, jsonMode: boolean): Promise<string> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error('GEMINI_API_KEY not configured');

  const models = ['gemini-2.0-flash-001', 'gemini-2.0-flash', 'gemini-2.5-flash'];
  let lastError: any = null;

  for (const model of models) {
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.2,
              maxOutputTokens: 4096,
              ...(jsonMode ? { responseMimeType: 'application/json' } : {})
            }
          })
        }
      );
      if (!res.ok) {
        const t = await res.text();
        lastError = new Error(`Gemini ${model} ${res.status}: ${t.slice(0, 200)}`);
        continue;
      }
      const data = await res.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) {
        console.log(`[AI] gemini/${model} ok`);
        return text;
      }
      lastError = new Error(`Gemini ${model} empty`);
    } catch (e: any) {
      lastError = e;
    }
  }
  throw lastError ?? new Error('All Gemini models failed');
}

async function callAI(prompt: string, jsonMode = true): Promise<string> {
  try {
    return await callOpenAICompatible(prompt, jsonMode);
  } catch (e: any) {
    console.warn(`[AI] falling to Gemini: ${e?.message}`);
    return await callGemini(prompt, jsonMode);
  }
}

function parseJSON<T = any>(raw: string): T {
  const cleaned = raw.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim();
  try {
    return JSON.parse(cleaned);
  } catch {
    const arr = cleaned.match(/\[[\s\S]*\]/);
    const obj = cleaned.match(/\{[\s\S]*\}/);
    const m = arr ?? obj;
    if (!m) throw new Error('AI returned invalid JSON');
    return JSON.parse(m[0]);
  }
}

// ---------- BOQ EXTRACTION ----------

export interface ExtractedBOQItem {
  description: string;
  unit: string | null;
  quantity: number;
  rate: number;
}

export async function extractBOQ(text: string): Promise<ExtractedBOQItem[]> {
  const prompt = `You are a construction/EPC quantity surveyor. Extract BOQ line items from the text below.

Rules:
- Return ONLY a JSON object: { "items": [ ... ] }
- Each item: { "description": string, "unit": string|null, "quantity": number, "rate": number }
- If rate is missing, estimate a realistic market rate in INR.
- Max 30 items.
- Normalize descriptions concisely (max 80 chars).

Text:
"""
${text.slice(0, 15000)}
"""`;

  const raw = await callAI(prompt, true);
  const parsed = parseJSON<any>(raw);
  const arr = Array.isArray(parsed) ? parsed : parsed.items ?? [];
  return arr
    .filter((x: any) => x && typeof x.description === 'string')
    .slice(0, 30)
    .map((x: any) => ({
      description: String(x.description).slice(0, 200),
      unit: x.unit ? String(x.unit).slice(0, 20) : null,
      quantity: Number(x.quantity) || 0,
      rate: Number(x.rate) || 0
    }));
}

// ---------- RISK SUMMARY (BOQ-aware) ----------

export interface RiskBullet {
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  detail: string;
}

export interface ProjectRiskContext {
  code: string;
  name: string;
  stage: string;
  health: string;
  currency: string;
  contractValue: number;
  boqTotal: number;
  boqItemCount: number;
  billed: number;
  collected: number;
  overdue: number;
  exceptions: { severity: string; message: string }[];
  daysToEnd: number | null;
}

export async function summarizeRisk(ctx: ProjectRiskContext): Promise<RiskBullet[]> {
  const boqRatio = ctx.contractValue > 0
    ? ((ctx.boqTotal / ctx.contractValue) * 100).toFixed(1)
    : '0';

  const prompt = `You are a senior EPC project risk analyst writing for the project owner.

Produce 3-6 risk bullets based on the data below.

Rules:
- Return ONLY a JSON object: { "risks": [ ... ] }
- Each item: { "severity": "low"|"medium"|"high"|"critical", "title": string (max 60 chars), "detail": string (max 160 chars) }
- Be specific to the numbers. Use the currency shown.
- PRIORITIZE: commercial/BOQ risk, cash risk, schedule risk, execution risk.
- If BOQ items exist (boqItemCount > 0), ALWAYS include one bullet comparing BOQ total vs contract value:
  * BOQ > contract → critical/high: "BOQ exceeds contract by X%"
  * BOQ < 60% of contract → medium: "BOQ underrun — possible scope gap"
  * BOQ 80-110% of contract → low: "BOQ aligns with contract"
  * BOQ 60-80% → medium: "Partial BOQ extracted"
- If no BOQ items, skip BOQ bullet entirely.

Project data:
${JSON.stringify(ctx, null, 2)}

BOQ ratio: ${boqRatio}% of contract`;

  const raw = await callAI(prompt, true);
  const parsed = parseJSON<any>(raw);
  const arr = Array.isArray(parsed) ? parsed : parsed.risks ?? [];
  return arr
    .filter((x: any) => x && typeof x.title === 'string')
    .slice(0, 6)
    .map((x: any) => ({
      severity: ['low', 'medium', 'high', 'critical'].includes(x.severity) ? x.severity : 'medium',
      title: String(x.title).slice(0, 120),
      detail: String(x.detail ?? '').slice(0, 300)
    }));
}
