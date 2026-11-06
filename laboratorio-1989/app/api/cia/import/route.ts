import { NextRequest, NextResponse } from 'next/server';
import { authorize } from '@/lib/auth';
import { db } from '@/lib/db';

export const runtime = 'nodejs';

function clean(value: unknown, max = 4000): string | null {
  if (typeof value !== 'string') return null;
  const v = value.trim();
  return v ? v.slice(0, max) : null;
}

export async function POST(request: NextRequest) {
  const denied = authorize(request);
  if (denied) return denied;
  try {
    const body = await request.json();
    const title = clean(body.title, 500);
    const sourceUrl = clean(body.source_url, 2000);
    if (!title) return NextResponse.json({ error: 'El título del documento es obligatorio.' }, { status: 400 });
    if (!sourceUrl) return NextResponse.json({ error: 'Se requiere el enlace al documento original de CIA.' }, { status: 400 });
    let parsed: URL;
    try { parsed = new URL(sourceUrl); } catch { return NextResponse.json({ error: 'La URL no es válida.' }, { status: 400 }); }
    if (parsed.protocol !== 'https:' || !['cia.gov', 'www.cia.gov'].includes(parsed.hostname) || !parsed.pathname.startsWith('/readingroom/')) {
      return NextResponse.json({ error: 'Sólo se admiten enlaces HTTPS del Electronic Reading Room oficial de cia.gov.' }, { status: 400 });
    }
    const sql = db();
    const existing = await sql`SELECT id FROM sources WHERE base_url = 'https://www.cia.gov/readingroom/' LIMIT 1`;
    let sourceId = (existing as any[])[0]?.id;
    if (!sourceId) {
      const insertedSource = await sql`INSERT INTO sources(name,institution,base_url,source_type,access_status,notes)
        VALUES('CIA Electronic Reading Room','Central Intelligence Agency','https://www.cia.gov/readingroom/','declassified_archive','verified','Repositorio oficial. Cada documento se registra sólo tras verificación manual del enlace y metadatos.') RETURNING id`;
      sourceId = (insertedSource as any[])[0]?.id;
    }
    const metadata = {
      collection: clean(body.collection, 500),
      esdn: clean(body.esdn, 250),
      original_classification: clean(body.original_classification, 100),
      publication_date: clean(body.publication_date, 30),
      content_type: clean(body.content_type, 150),
      case_number: clean(body.case_number, 250),
      imported_from: 'CIA Electronic Reading Room',
      metadata_verification: 'user_entered_unverified'
    };
    const rows = await sql`INSERT INTO documents
      (source_id,title,source_url,abstract,institution,document_type,document_date,archive_reference,country,metadata,verification_status)
      VALUES (${sourceId},${title},${sourceUrl},${clean(body.abstract)},'Central Intelligence Agency',${metadata.content_type},${metadata.publication_date || null},${metadata.esdn},${clean(body.country,100)},${JSON.stringify(metadata)}::jsonb,'unreviewed')
      RETURNING id,title,source_url,archive_reference,verification_status,created_at`;
    return NextResponse.json({ document: (rows as any[])[0], note: 'Registro incorporado. Los metadatos requieren revisión documental antes de considerarse verificados.' }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'No se pudo incorporar el documento.' }, { status: 503 });
  }
}
