import { NextResponse } from 'next/server';
import { extractBOQ } from '@/lib/ai/gemini';
import { createClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';
export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const { text, projectId, save } = await req.json();

    if (!text || typeof text !== 'string' || text.trim().length < 10) {
      return NextResponse.json({ error: 'Text too short' }, { status: 400 });
    }

    const items = await extractBOQ(text);

    if (save && projectId) {
      const supabase = await createClient();
      const rows = items.map((i) => ({
        project_id: projectId,
        description: i.description,
        unit: i.unit,
        quantity: i.quantity,
        rate: i.rate,
        source: 'ai_extracted'
      }));
      const { error } = await supabase.from('boq_items').insert(rows);
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ items });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? 'Unknown error' }, { status: 500 });
  }
}
