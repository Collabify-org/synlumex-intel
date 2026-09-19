import { NextResponse } from 'next/server';
import { extractBOQ } from '@/lib/ai/provider';

export const runtime = 'nodejs';
export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const projectId = formData.get('projectId') as string | null;

    if (!file) return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    if (file.size > 10 * 1024 * 1024)
      return NextResponse.json({ error: 'File too large (max 10MB)' }, { status: 400 });

    const arrayBuffer = await file.arrayBuffer();

    // Use pdfjs-dist — Mozilla's PDF.js, far more tolerant than pdf-parse
    const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');

    let text = '';
    try {
      const loadingTask = pdfjs.getDocument({
        data: new Uint8Array(arrayBuffer),
        useSystemFonts: true,
        isEvalSupported: false,
        disableFontFace: true
      });
      const doc = await loadingTask.promise;
      const pages: string[] = [];

      for (let i = 1; i <= doc.numPages; i++) {
        const page = await doc.getPage(i);
        const content = await page.getTextContent();
        const pageText = content.items
          .map((item: any) => ('str' in item ? item.str : ''))
          .join(' ');
        pages.push(pageText);
      }

      text = pages.join('\n\n');
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
      pages: text.split('\n\n').length,
      preview: text.slice(0, 400)
    });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? 'Unknown error' }, { status: 500 });
  }
}
