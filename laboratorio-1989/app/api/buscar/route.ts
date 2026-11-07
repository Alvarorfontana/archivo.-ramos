import { NextRequest, NextResponse } from 'next/server';
export const runtime = 'nodejs';

// Buscador federado: una ruta, un proveedor por llamada (el cliente las lanza en paralelo).
// Todas las fuentes son públicas y gratuitas. NARA solo necesita NARA_API_KEY.

type Resultado = { titulo: string; url: string; fecha?: string; autor?: string; descripcion?: string; formato?: string; imagen?: string };
const UA = { 'user-agent': '1989-archive-research/1.0 (investigacion historica)', accept: 'application/json' };

function dec(v: string) { return v.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'"); }
function tag(b: string, n: string) { const m = b.match(new RegExp('<' + n + '(?:\\s[^>]*)?>([\\s\\S]*?)<\\/' + n + '>', 'i')); return m ? dec(m[1].replace(/<[^>]+>/g, '').trim()) : ''; }
const clip = (s: any, n = 280) => { const t = String(s ?? '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim(); return t.length > n ? t.slice(0, n) + '…' : t; };
const first = (v: any) => Array.isArray(v) ? v[0] : v;

async function getJson(url: string, headers: Record<string, string> = UA) {
  const r = await fetch(url, { headers, next: { revalidate: 3600 }, signal: AbortSignal.timeout(12000) });
  if (!r.ok) throw new Error('HTTP ' + r.status);
  return r.json();
}

const proveedores: Record<string, (q: string) => Promise<Resultado[]>> = {
  async frus(q) {
    const r = await fetch('https://history.state.gov/api/v1/catalog/search?q=' + encodeURIComponent(q), { headers: { accept: 'application/atom+xml, application/xml' }, next: { revalidate: 3600 }, signal: AbortSignal.timeout(12000) });
    if (!r.ok) throw new Error('HTTP ' + r.status);
    const xml = await r.text();
    return [...xml.matchAll(/<entry\b[^>]*>([\s\S]*?)<\/entry>/gi)].map(m => {
      const b = m[1]; const href = (b.match(/<link\b[^>]*href="([^"]+)"/i) || [])[1] || tag(b, 'id');
      return { titulo: tag(b, 'title'), url: dec(href), descripcion: clip(tag(b, 'summary')), formato: 'Volumen FRUS' };
    }).filter(x => x.titulo).slice(0, 15);
  },
  async nara(q) {
    const key = process.env.NARA_API_KEY;
    if (!key) throw Object.assign(new Error('Falta NARA_API_KEY (gratuita, se pide a Catalog_API@nara.gov). Mientras tanto usá el enlace directo al catálogo.'), { code: 'not_configured' });
    const u = new URL('https://catalog.archives.gov/api/v2/records/search'); u.searchParams.set('q', q); u.searchParams.set('limit', '15');
    const p = await getJson(u.toString(), { 'x-api-key': key, accept: 'application/json' });
    return (p.body?.hits?.hits || []).map((h: any) => { const m = h._source?.record || h._source?.metadata || {}; return { titulo: m.title || 'Registro sin título', url: 'https://catalog.archives.gov/id/' + h._id, fecha: m.productionDates?.[0]?.logicalDate || m.coverageStartDate?.logicalDate || '', descripcion: clip(m.scopeAndContentNote), formato: m.levelOfDescription || 'Registro NARA' }; });
  },
  async crossref(q) {
    const p = await getJson('https://api.crossref.org/works?rows=12&select=DOI,title,author,issued,container-title,type&query.bibliographic=' + encodeURIComponent(q));
    return (p.message?.items || []).map((x: any) => ({ titulo: first(x.title) || 'Sin título', url: 'https://doi.org/' + x.DOI, fecha: String(x.issued?.['date-parts']?.[0]?.[0] || ''), autor: (x.author || []).slice(0, 3).map((a: any) => [a.given, a.family].filter(Boolean).join(' ')).join(', '), descripcion: first(x['container-title']) || '', formato: x.type }));
  },
  async openalex(q) {
    const p = await getJson('https://api.openalex.org/works?per-page=12&select=id,doi,title,publication_year,authorships,primary_location,type&search=' + encodeURIComponent(q));
    return (p.results || []).map((x: any) => ({ titulo: x.title || 'Sin título', url: x.doi || x.id, fecha: String(x.publication_year || ''), autor: (x.authorships || []).slice(0, 3).map((a: any) => a.author?.display_name).filter(Boolean).join(', '), descripcion: x.primary_location?.source?.display_name || '', formato: x.type }));
  },
  async loc(q) {
    const p = await getJson('https://www.loc.gov/search/?fo=json&c=15&q=' + encodeURIComponent(q));
    return (p.results || []).filter((x: any) => x.url).map((x: any) => ({ titulo: clip(x.title, 160), url: x.url, fecha: x.date || '', descripcion: clip(first(x.description)), formato: first(x.original_format) || 'Library of Congress', imagen: first(x.image_url) }));
  },
  async hemeroteca(q) { return archive(q, 'texts'); },
  async audiovisual(q) { return archive(q, '(audio OR movies)'); },
  async imagenes(q) {
    const p = await getJson('https://commons.wikimedia.org/w/api.php?action=query&format=json&origin=*&generator=search&gsrnamespace=6&gsrlimit=15&prop=imageinfo&iiprop=url|extmetadata&iiurlwidth=320&gsrsearch=' + encodeURIComponent(q));
    return Object.values(p.query?.pages || {}).map((x: any) => { const ii = x.imageinfo?.[0] || {}; const md = ii.extmetadata || {}; return { titulo: x.title.replace(/^File:/, ''), url: ii.descriptionurl || 'https://commons.wikimedia.org/wiki/' + encodeURIComponent(x.title), fecha: clip(md.DateTimeOriginal?.value, 40), autor: clip(md.Artist?.value, 80), descripcion: clip(md.ImageDescription?.value, 200), formato: 'Imagen · ' + (md.LicenseShortName?.value || 'ver licencia'), imagen: ii.thumburl }; });
  },
  async wikidata(q) {
    const p = await getJson('https://www.wikidata.org/w/api.php?action=wbsearchentities&format=json&language=es&uselang=es&limit=12&search=' + encodeURIComponent(q));
    return (p.search || []).map((x: any) => ({ titulo: x.label, url: x.concepturi, descripcion: x.description || '', formato: 'Entidad ' + x.id }));
  },
};

async function archive(q: string, mediatype: string): Promise<Resultado[]> {
  const u = 'https://archive.org/advancedsearch.php?output=json&rows=15&fl[]=identifier&fl[]=title&fl[]=date&fl[]=creator&fl[]=mediatype&fl[]=description&q=' + encodeURIComponent('(' + q + ') AND mediatype:' + mediatype);
  const p = await getJson(u);
  return (p.response?.docs || []).map((x: any) => ({ titulo: first(x.title) || x.identifier, url: 'https://archive.org/details/' + x.identifier, fecha: String(x.date || '').slice(0, 10), autor: clip(first(x.creator), 80), descripcion: clip(first(x.description), 220), formato: x.mediatype === 'audio' ? 'Audio' : x.mediatype === 'movies' ? 'Video' : 'Texto', imagen: 'https://archive.org/services/img/' + x.identifier }));
}

export async function GET(req: NextRequest) {
  const fuente = req.nextUrl.searchParams.get('fuente') || '';
  const q = (req.nextUrl.searchParams.get('q') || '').trim().slice(0, 200);
  const fn = proveedores[fuente];
  if (!fn) return NextResponse.json({ error: 'Fuente desconocida', disponibles: Object.keys(proveedores) }, { status: 400 });
  if (!q) return NextResponse.json({ error: 'Escribí qué buscar.' }, { status: 400 });
  try {
    const resultados = await fn(q);
    return NextResponse.json({ fuente, q, resultados });
  } catch (e: any) {
    return NextResponse.json({ fuente, q, resultados: [], estado: e?.code || 'error', error: e?.code === 'not_configured' ? e.message : /fetch failed|abort|timeout/i.test(String(e?.message)) ? 'El archivo no respondió a tiempo. Probá de nuevo en un rato o usá la búsqueda directa de abajo.' : 'El archivo respondió con un error (' + (e?.message || 'desconocido') + ').' }, { status: e?.code === 'not_configured' ? 200 : 502 });
  }
}
