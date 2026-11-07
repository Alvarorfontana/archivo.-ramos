import { NextRequest, NextResponse } from 'next/server';
export const runtime = 'nodejs';
export const revalidate = 3600;
function decodeXml(value: string) {
  return value.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'");
}
function tag(block: string, name: string) {
  const match = block.match(new RegExp('<' + name + '(?:\\s[^>]*)?>([\\s\\S]*?)<\\/' + name + '>','i'));
  return match ? decodeXml(match[1].replace(/<[^>]+>/g, '').trim()) : '';
}
function attr(source: string, name: string) {
  const doubleQuoted = source.match(new RegExp(name + '="([^"]+)"', 'i'));
  const singleQuoted = source.match(new RegExp(name + "='([^']+)'", 'i'));
  return doubleQuoted ? decodeXml(doubleQuoted[1]) : singleQuoted ? decodeXml(singleQuoted[1]) : '';
}
export async function GET(request: NextRequest) {
  const q = (request.nextUrl.searchParams.get('q') || '').trim().slice(0, 180);
  if (!q) return NextResponse.json({ error: 'Ingresá términos para buscar en FRUS.' }, { status: 400 });
  try {
    const url = 'https://history.state.gov/api/v1/catalog/search?q=' + encodeURIComponent(q);
    const response = await fetch(url, { headers: { accept: 'application/atom+xml, application/xml, text/xml' }, next: { revalidate: 3600 } });
    if (!response.ok) return NextResponse.json({ source: 'FRUS · Office of the Historian', status: 'error', error: 'FRUS respondió HTTP ' + response.status, results: [] }, { status: 502 });
    const xml = await response.text();
    const results = [...xml.matchAll(/<entry\b[^>]*>([\s\S]*?)<\/entry>/gi)].map(match => {
      const block = match[1];
      const links = [...block.matchAll(/<link\b([^>]*)\/?>/gi)].map(link => ({ href: attr(link[1], 'href'), rel: attr(link[1], 'rel'), type: attr(link[1], 'type'), title: attr(link[1], 'title') })).filter(link => link.href);
      return { title: tag(block, 'title'), id: tag(block, 'id'), summary: tag(block, 'summary'), links };
    }).filter(item => item.title).slice(0, 30);
    return NextResponse.json({ source: 'FRUS · Office of the Historian', query: q, queryUrl: url, count: results.length, results, note: 'Catálogo de volúmenes y materias FRUS. Un resultado de catálogo no equivale por sí solo a una cita documental; abrir el volumen y localizar el documento/página.' });
  } catch (error) {
    return NextResponse.json({ source: 'FRUS · Office of the Historian', status: 'error', error: error instanceof Error ? error.message : 'Error de consulta', results: [] }, { status: 502 });
  }
}
