import { NextRequest, NextResponse } from 'next/server';
export const runtime = 'nodejs';
export const revalidate = 3600;
export async function GET(request: NextRequest) {
  const q = (request.nextUrl.searchParams.get('q') || '').trim().slice(0, 180);
  if (!q) return NextResponse.json({ error: 'Ingresá términos de búsqueda.' }, { status: 400 });
  try {
    const url = new URL('https://api.crossref.org/works');
    url.searchParams.set('query.bibliographic', q);
    url.searchParams.set('rows', '12');
    url.searchParams.set('select', 'DOI,title,published-print,published-online,author,container-title,URL,type');
    const response = await fetch(url, { headers: { 'User-Agent': '1989ArchiveResearch/1.0 (historical research portal)' }, next: { revalidate: 3600 } });
    if (!response.ok) throw new Error('Crossref respondió HTTP ' + response.status);
    const payload = await response.json();
    const results = (payload.message?.items || []).map((item: any) => ({
      title: item.title?.[0] || 'Sin título',
      date: item['published-print']?.['date-parts']?.[0]?.join('-') || item['published-online']?.['date-parts']?.[0]?.join('-') || '',
      authors: (item.author || []).slice(0, 5).map((a: any) => [a.given, a.family].filter(Boolean).join(' ')),
      publication: item['container-title']?.[0] || '',
      doi: item.DOI || '',
      url: item.URL || (item.DOI ? 'https://doi.org/' + item.DOI : ''),
      type: item.type || 'work'
    }));
    return NextResponse.json({ source: 'Crossref Works', query: q, count: results.length, results, note: 'Bibliografía académica y metadatos editoriales; no sustituye fuentes primarias.' });
  } catch (error) {
    return NextResponse.json({ source: 'Crossref Works', error: error instanceof Error ? error.message : 'Error de consulta', results: [] }, { status: 502 });
  }
}
