// ============================================================
// Gemini AI Client — with model auto-fallback
// ============================================================

const GEMINI_MODELS = [
  'gemini-3.6-flash',
  'gemini-2.5-flash',
  'gemini-2.0-flash',
  'gemini-1.5-flash-latest',
  'gemini-1.5-pro-latest'
];

function urlFor(model: string) {
  return `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
}

function getKey() {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error('GEMINI_API_KEY not configured');
  return key;
}

async function callGemini(prompt: string, jsonMode = false): Promise<string> {
  let lastError: Error | null = null;

  for (const model of GEMINI_MODELS) {
    try {
      const res = await fetch(`${urlFor(model)}?key=${getKey()}`, {
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
      });

      if (!res.ok) {
        const errText = await res.text();
        // Try next model if it's a "not found" / "no longer available" error
        if (
          errText.includes('NOT_FOUND') ||
          errText.includes('no longer available') ||
          errText.includes('is not found for API version')
        ) {
          lastError = new Error(`Model ${model} unavailable: ${errText.slice(0, 200)}`);
          continue;
        }
        // Any other error is fatal — don't rotate models
        throw new Error(`Gemini API error ${res.status}: ${errText.slice(0, 500)}`);
      }

      const data = await res.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) {
        lastError = new Error(`Model ${model} returned empty response`);
        continue;
      }
      return text;
    } catch (e: any) {
      const msg = String(e?.message ?? '');
      if (
        msg.includes('NOT_FOUND') ||
        msg.includes('no longer available') ||
        msg.includes('is not found for API version')
      ) {
        lastError = e;
        continue;
      }
      throw e;
    }
  }

  throw lastError ?? new Error('All Gemini models unavailable — check GEMINI_API_KEY and model names');
}

// ---------- BOQ EXTRACTION ----------

export interface ExtractedBOQItem {
  description: string;
  unit: string | null;
  quantity: number;
  rate: number;
}

export async function extractBOQ(text: string): Promise<ExtractedBOQItem[]> {
  const prompt = `You are a construction/EPC quantity surveyor. Extract BOQ (Bill of Quantities) line items from the text below.

Rules:
- Return ONLY a JSON array. No prose, no markdown fences.
- Each item: { "description": string, "unit": string|null, "quantity": number, "rate": number }
- If rate is missing, estimate a realistic market rate in INR.
- If unit is unclear, use null.
- Max 30 items.
- Normalize descriptions to be concise (max 80 chars).

Text to extract from:
"""
${text.slice(0, 15000)}
"""`;

  const raw = await callGemini(prompt, true);
  const cleaned = raw.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim();

  let parsed: any;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    // Sometimes the model wraps in an object like { "items": [...] }
    const match = cleaned.match(/\[[\s\S]*\]/);
    if (!match) throw new Error('AI returned invalid JSON');
    parsed = JSON.parse(match[0]);
  }

  if (!Array.isArray(parsed)) throw new Error('Expected JSON array from AI');

  return parsed
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
  const prompt = `You are a senior EPC project risk analyst. Based on the project data below, produce 3-5 risk bullets for the owner.

Rules:
- Return ONLY a JSON array. No prose, no markdown fences.
- Each item: { "severity": "low"|"medium"|"high"|"critical", "title": string (max 60 chars), "detail": string (max 160 chars) }
- Be specific to the numbers given. Do not invent data.
- Prioritize: schedule risk, cash risk, execution risk.

Project data:
${JSON.stringify(ctx, null, 2)}`;

  const raw = await callGemini(prompt, true);
  const cleaned = raw.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim();

  let parsed: any;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    const match = cleaned.match(/\[[\s\S]*\]/);
    if (!match) throw new Error('AI returned invalid JSON');
    parsed = JSON.parse(match[0]);
  }

  if (!Array.isArray(parsed)) throw new Error('Expected JSON array from AI');

  return parsed
    .filter((x: any) => x && typeof x.title === 'string')
    .slice(0, 6)
    .map((x: any) => ({
      severity: ['low', 'medium', 'high', 'critical'].includes(x.severity)
        ? x.severity
        : 'medium',
      title: String(x.title).slice(0, 120),
      detail: String(x.detail ?? '').slice(0, 300)
    }));
}
