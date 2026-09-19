import { NextResponse } from 'next/server';
import { extractBOQ } from '@/lib/ai/provider';
import { createClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';
export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const projectId = formData.get('projectId') as string | null;

    if (!file) return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    if (file.size > 10 * 1024 * 1024) return NextResponse.json({ error: 'File too large (max 10MB)' }, { status: 400 });

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Dynamic import — pdf-parse is CommonJS
    const pdfParse = (await import('pdf-parse')).default;

    let text = '';
    try {
      const parsed = await pdfParse(buffer);
      text = parsed.text ?? '';
    } catch (e: any) {
      return NextResponse.json(
        { error: `Could not parse PDF: ${e.message ?? 'unknown'}` },
        { status: 400 }
      );
    }

    if (!text || text.trim().length < 20) {
      return NextResponse.json(
        { error: 'PDF has no readable text (may be scanned image — OCR not supported yet).' },
        { status: 400 }
      );
    }

    const items = await extractBOQ(text);

    return NextResponse.json({
      items,
      textLength: text.length,
      preview: text.slice(0, 400)
    });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? 'Unknown error' }, { status: 500 });
  }
}
