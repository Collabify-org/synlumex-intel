import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const providers = [
    { name: 'groq', envVar: 'GROQ_API_KEY', value: process.env.GROQ_API_KEY },
    { name: 'cerebras', envVar: 'CEREBRAS_API_KEY', value: process.env.CEREBRAS_API_KEY },
    { name: 'sambanova', envVar: 'SAMBANOVA_API_KEY', value: process.env.SAMBANOVA_API_KEY },
    { name: 'gemini', envVar: 'GEMINI_API_KEY', value: process.env.GEMINI_API_KEY }
  ];

  // Live test: try Groq with a tiny prompt
  let groqTest = 'skipped';
  if (process.env.GROQ_API_KEY) {
    try {
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [{ role: 'user', content: 'say ok' }],
          max_tokens: 5
        })
      });
      const data = await res.json();
      groqTest = res.ok ? `ok: ${data.choices?.[0]?.message?.content}` : `error ${res.status}: ${JSON.stringify(data).slice(0, 200)}`;
    } catch (e: any) {
      groqTest = `exception: ${e.message}`;
    }
  }

  return NextResponse.json({
    providers: providers.map((p) => ({
      name: p.name,
      envVar: p.envVar,
      present: !!p.value,
      prefix: p.value ? p.value.slice(0, 8) + '…' : null,
      length: p.value?.length ?? 0
    })),
    groqLiveTest: groqTest
  });
}
