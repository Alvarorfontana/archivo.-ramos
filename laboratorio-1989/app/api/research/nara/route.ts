import { NextRequest, NextResponse } from 'next/server';
export const runtime = 'nodejs';
export async function GET(request: NextRequest) {
  const q = (request.nextUrl.searchParams.get('q') || '').trim().slice(0, 180);
  if (!q) return NextResponse.json({ error: 'Ingresá términos de búsqueda.' }, { status: 400 });
  const key = process.env.NARA_API_KEY;
  if (!key) return NextResponse.json({ source: 'NARA Catalog API', status: 'not_configured', error: 'NARA_API_KEY no está configurada en el entorno de Vercel. La clave debe cargarse como variable de entorno privada; nunca en el navegador ni en GitHub.' }, { status: 503 });
  try {
    const url = new URL('https://catalog.archives.gov/api/v2/records/search');
    url.searchParams.set('q', q);
    url.searchParams.set('availableOnline', 'true');
    const response = await fetch(url, { headers: { 'x-api-key': key, accept: 'application/json' }, cache: 'no-store' });
    if (!response.ok) return NextResponse.json({ source: 'NARA Catalog API', status: 'error', error: 'NARA respondió HTTP ' + response.status }, { status: 502 });
    const payload = await response.json();
    const hits = payload.body?.hits?.hits || [];
    const results = hits.map((hit: any) => {
      const m = hit._source?.metadata || {};
      return { id: hit._id, title: m.title || m.objectTitle || 'Registro sin título', description: m.scopeAndContentNote || m.generalNote || '', date: m.productionDates?.[0]?.logicalDate || m.coverageDates?.[0]?.logicalDate || '', url: 'https://catalog.archives.gov/id/' + hit._id, naId: hit._id };
    });
    return NextResponse.json({ source: 'NARA Catalog API', query: q, count: payload.body?.hits?.total?.value ?? results.length, results, note: 'Metadatos del catálogo NARA. Revisar disponibilidad, descripción y objeto digital en el registro original.' });
  } catch (error) {
    return NextResponse.json({ source: 'NARA Catalog API', status: 'error', error: error instanceof Error ? error.message : 'Error de consulta' }, { status: 502 });
  }
}
