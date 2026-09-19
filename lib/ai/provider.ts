// ============================================================
// Unified AI Provider — Waterfall Fallback (All Free Tiers)
// Order: Groq → Cerebras → SambaNova → Gemini
// ============================================================

import OpenAI from 'openai';

type Provider = {
  name: string;
  baseURL: string;
  apiKey: string | undefined;
  model: string;
};

const PROVIDERS: Provider[] = [
  {
    name: 'groq',
    baseURL: 'https://api.groq.com/openai/v1',
    apiKey: process.env.GROQ_API_KEY,
    model: 'llama-3.3-70b-versatile'
  },
  {
    name: 'cerebras',
    baseURL: 'https://api.cerebras.ai/v1',
    apiKey: process.env.CEREBRAS_API_KEY,
    model: 'llama3.3-70b'
  },
  {
    name: 'sambanova',
    baseURL: 'https://api.sambanova.ai/v1',
    apiKey: process.env.SAMBANOVA_API_KEY,
    model: 'Meta-Llama-3.3-70B-Instruct'
  }
];

async function callOpenAICompatible(prompt: string, jsonMode: boolean): Promise<string> {
  let lastError: any = null;

  for (const p of PROVIDERS) {
    if (!p.apiKey) continue;
    try {
      const client = new OpenAI({ apiKey: p.apiKey, baseURL: p.baseURL });
      const res = await client.chat.completions.create({
        model: p.model,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.2,
        max_tokens: 4096,
        ...(jsonMode ? { response_format: { type: 'json_object' } } : {})
      });
      const content = res.choices?.[0]?.message?.content;
      if (content) return content;
      lastError = new Error(`${p.name} returned empty`);
    } catch (e: any) {
      lastError = e;
      const status = e?.status ?? e?.response?.status;
      if (status === 429 || status === 401 || status === 403 || status === 500 || status === 503) {
        console.warn(`[AI] ${p.name} failed (${status}), trying next provider`);
        continue;
      }
      throw e;
    }
  }
  throw lastError ?? new Error('All AI providers failed or none configured');
}

async function callGemini(prompt: string, jsonMode: boolean): Promise<string> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error('GEMINI_API_KEY not configured');

  const models = ['gemini-3.6-flash', 'gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash-latest'];
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
        if (t.includes('NOT_FOUND') || t.includes('no longer available') || t.includes('not found for API version')) {
          lastError = new Error(`${model} unavailable`);
          continue;
        }
        throw new Error(`Gemini error ${res.status}: ${t.slice(0, 300)}`);
      }
      const data = await res.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) return text;
      lastError = new Error(`${model} empty response`);
    } catch (e: any) {
      lastError = e;
      const msg = String(e?.message ?? '');
      if (msg.includes('NOT_FOUND') || msg.includes('no longer available')) continue;
      throw e;
    }
  }
  throw lastError ?? new Error('All Gemini models failed');
}

async function callAI(prompt: string, jsonMode = true): Promise<string> {
  try {
    return await callOpenAICompatible(prompt, jsonMode);
  } catch (e) {
    console.warn('[AI] OpenAI-compatible providers failed, falling back to Gemini');
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
    const match = arr ?? obj;
    if (!match) throw new Error('AI returned invalid JSON');
    return JSON.parse(match[0]);
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

// ---------- RISK SUMMARY ----------

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
  billed: number;
  collected: number;
  overdue: number;
  exceptions: { severity: string; message: string }[];
  daysToEnd: number | null;
}

export async function summarizeRisk(ctx: ProjectRiskContext): Promise<RiskBullet[]> {
  const prompt = `You are a senior EPC project risk analyst. Produce 3-5 risk bullets.

Rules:
- Return ONLY a JSON object: { "risks": [ ... ] }
- Each item: { "severity": "low"|"medium"|"high"|"critical", "title": string (max 60 chars), "detail": string (max 160 chars) }
- Be specific to the numbers given.

Project data:
${JSON.stringify(ctx, null, 2)}`;

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
