import { NextRequest, NextResponse } from 'next/server';
export const runtime = 'nodejs';
export const revalidate = 3600;
export async function GET(request: NextRequest) {
  const q = (request.nextUrl.searchParams.get('q') || '').trim().slice(0, 180);
  if (!q) return NextResponse.json({ error: 'Ingresá términos de búsqueda.' }, { status: 400 });
  try {
    const url = new URL('https://api.openalex.org/works');
    url.searchParams.set('search', q);
    url.searchParams.set('per-page', '12');
    url.searchParams.set('select', 'id,doi,title,publication_year,authorships,primary_location,type');
    const response = await fetch(url, { headers: { accept: 'application/json' }, next: { revalidate: 3600 } });
    if (!response.ok) throw new Error('OpenAlex respondió HTTP ' + response.status);
    const payload = await response.json();
    const results = (payload.results || []).map((item: any) => ({
      title: item.title || 'Sin título',
      year: item.publication_year || '',
      authors: (item.authorships || []).slice(0, 5).map((a: any) => a.author?.display_name).filter(Boolean),
      publication: item.primary_location?.source?.display_name || '',
      doi: item.doi || '',
      url: item.doi || item.id,
      type: item.type || 'work'
    }));
    return NextResponse.json({ source: 'OpenAlex Works', query: q, count: results.length, results, note: 'Literatura científica y académica; sirve para contextualizar y localizar estudios, no como fuente primaria de hechos.' });
  } catch (error) {
    return NextResponse.json({ source: 'OpenAlex Works', error: error instanceof Error ? error.message : 'Error de consulta', results: [] }, { status: 502 });
  }
}
