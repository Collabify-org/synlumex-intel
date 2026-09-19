import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const GROQ_MODELS = [
  'llama-3.1-8b-instant',
  'llama-3.3-70b-versatile',
  'llama-3.1-70b-versatile',
  'mixtral-8x7b-32768'
];

export async function GET() {
  const key = process.env.GROQ_API_KEY;
  const results: any[] = [];

  if (key) {
    for (const model of GROQ_MODELS) {
      try {
        const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${key}`
          },
          body: JSON.stringify({
            model,
            messages: [{ role: 'user', content: 'say ok' }],
            max_tokens: 5
          })
        });
        const data = await res.json();
        results.push({
          model,
          ok: res.ok,
          status: res.status,
          response: res.ok ? data.choices?.[0]?.message?.content : JSON.stringify(data).slice(0, 150)
        });
      } catch (e: any) {
        results.push({ model, ok: false, error: e.message });
      }
    }
  }

  return NextResponse.json({
    providers: {
      groq: { present: !!process.env.GROQ_API_KEY, prefix: process.env.GROQ_API_KEY?.slice(0, 8) + '…' },
      cerebras: { present: !!process.env.CEREBRAS_API_KEY, prefix: process.env.CEREBRAS_API_KEY?.slice(0, 8) + '…' },
      sambanova: { present: !!process.env.SAMBANOVA_API_KEY },
      gemini: { present: !!process.env.GEMINI_API_KEY, prefix: process.env.GEMINI_API_KEY?.slice(0, 8) + '…' }
    },
    groqModelTests: results
  });
}
