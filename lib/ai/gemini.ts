// ============================================================
// Unified AI Provider — Waterfall Fallback (All Free)
// ============================================================

import OpenAI from 'openai';
import { extractBOQ as extractBOQGemini, summarizeRisk as summarizeRiskGemini } from './gemini';

// --- Provider Configs ---
const PROVIDERS = [
  {
    name: 'groq',
    baseURL: 'https://api.groq.com/openai/v1',
    apiKey: process.env.GROQ_API_KEY,
    model: 'llama-3.3-70b-versatile',
    jsonSupport: true
  },
  {
    name: 'cerebras',
    baseURL: 'https://api.cerebras.ai/v1',
    apiKey: process.env.CEREBRAS_API_KEY,
    model: 'llama3.3-70b',
    jsonSupport: true
  },
  {
    name: 'sambanova',
    baseURL: 'https://api.sambanova.ai/v1',
    apiKey: process.env.SAMBANOVA_API_KEY,
    model: 'Meta-Llama-3.3-70B-Instruct',
    jsonSupport: true
  }
];

// --- Generic Fallback Executor ---
async function callWithFallback(prompt: string, jsonMode: boolean = false): Promise<string> {
  let lastError: any = null;

  for (const provider of PROVIDERS) {
    if (!provider.apiKey) continue; // Skip if key not configured

    try {
      const client = new OpenAI({
        apiKey: provider.apiKey,
        baseURL: provider.baseURL
      });

      const response = await client.chat.completions.create({
        model: provider.model,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.2,
        max_tokens: 4096,
        response_format: jsonMode && provider.jsonSupport ? { type: 'json_object' } : undefined
      });

      const content = response.choices[0]?.message?.content;
      if (content) return content;

    } catch (error: any) {
      lastError = error;
      // If it's a rate limit or auth issue, try next provider
      if (error.status === 429 || error.status === 401 || error.status === 403) {
        console.warn(`[AI Fallback] Provider ${provider.name} failed, trying next...`);
        continue;
      }
      // Otherwise, it's a fatal error (e.g., bad prompt)
      throw error;
    }
  }

  // --- Final Fallback: Gemini (if all OpenAI-compatible providers fail) ---
  try {
    // Note: We need to import the raw Gemini caller. 
    // For now, we'll just throw a specific error, or you can refactor gemini.ts to export a raw caller.
    console.warn('[AI Fallback] All OpenAI-compatible providers failed, trying Gemini...');
    // This is a placeholder. You would call the raw gemini client here.
    throw new Error('Gemini fallback not yet wired in this snippet');
  } catch (geminiError) {
    throw lastError || geminiError;
  }
}

// --- Wrapper for BOQ Extraction ---
export async function extractBOQ(text: string) {
  const prompt = `You are a construction/EPC quantity surveyor. Extract BOQ line items from the text below.
  
Rules:
- Return ONLY a JSON object with a single key "items", which is an array.
- Each item: { "description": string, "unit": string|null, "quantity": number, "rate": number }
- Max 30 items.

Text:
"""
${text.slice(0, 15000)}
"""`;

  const raw = await callWithFallback(prompt, true);
  const parsed = JSON.parse(raw);
  const items = parsed.items || parsed; // Handle both {items: []} and []
  
  return items.filter((x: any) => x && x.description).slice(0, 30);
}

// --- Wrapper for Risk Summary ---
export async function summarizeRisk(ctx: any) {
  const prompt = `You are a senior EPC project risk analyst. Produce 3-5 risk bullets.
  
Rules:
- Return ONLY a JSON object with a single key "risks", which is an array.
- Each item: { "severity": "low"|"medium"|"high"|"critical", "title": string, "detail": string }

Project data:
${JSON.stringify(ctx, null, 2)}`;

  const raw = await callWithFallback(prompt, true);
  const parsed = JSON.parse(raw);
  const risks = parsed.risks || parsed;
  
  return risks.slice(0, 6);
}
