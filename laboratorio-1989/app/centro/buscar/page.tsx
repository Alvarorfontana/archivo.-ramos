'use client';
import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { expedientes } from '@/data/caso';
import { GuardarEvidencia, type Borrador } from '@/components/ui';

type R = { titulo: string; url: string; fecha?: string; autor?: string; descripcion?: string; formato?: string; imagen?: string };
type Estado = { cargando: boolean; resultados: R[]; error?: string; estado?: string };

const FUENTES = [
  { id: 'frus', nombre: 'FRUS · Departamento de Estado', grupo: 'Archivos oficiales' },
  { id: 'nara', nombre: 'NARA · Archivo Nacional de EE.UU.', grupo: 'Archivos oficiales' },
  { id: 'hemeroteca', nombre: 'Internet Archive · textos y prensa', grupo: 'Prensa y hemeroteca' },
  { id: 'loc', nombre: 'Library of Congress', grupo: 'Prensa y hemeroteca' },
  { id: 'audiovisual', nombre: 'Internet Archive · audio y video', grupo: 'Audio y video' },
  { id: 'imagenes', nombre: 'Wikimedia Commons · fotos y mapas', grupo: 'Imágenes y mapas' },
  { id: 'openalex', nombre: 'OpenAlex · estudios', grupo: 'Académico' },
  { id: 'crossref', nombre: 'Crossref · artículos y libros', grupo: 'Académico' },
  { id: 'wikidata', nombre: 'Wikidata · personas e instituciones', grupo: 'Entidades' },
];
const GRUPOS = [...new Set(FUENTES.map(f => f.grupo))];

const DIRECTOS = (q: string) => {
  const e = encodeURIComponent(q); const g = (site: string) => 'https://www.google.com/search?q=' + encodeURIComponent('site:' + site + ' ' + q);
  return [
    ['CIA · Reading Room (desclasificados)', 'https://www.cia.gov/readingroom/search/site/' + e],
    ['Catálogo NARA (web)', 'https://catalog.archives.gov/search?q=' + e],
    ['Biblioteca Bush · memcons y telcons', g('bush41library.tamu.edu')],
    ['Departamento de Estado · FOIA', g('foia.state.gov')],
    ['National Security Archive', 'https://nsarchive.gwu.edu/search?search_api_fulltext=' + e],
    ['Wilson Center Digital Archive', 'https://digitalarchive.wilsoncenter.org/search?search_api_fulltext=' + e],
    ['Revista Proceso (México)', g('proceso.com.mx')],
    ['Hemeroteca Nacional Digital de México', g('hndm.iib.unam.mx')],
    ['Página/12 (Argentina)', g('pagina12.com.ar')],
    ['InfoLEG · decretos argentinos', g('argentina.gob.ar/normativa')],
    ['Google Libros', 'https://www.google.com/search?tbm=bks&q=' + e],
    ['Google Noticias · archivo', 'https://news.google.com/newspapers?q=' + e],
  ];
};

function Buscador() {
  const sp = useSearchParams(); const router = useRouter();
  const inicial = sp.get('q') || '';
  const [q, setQ] = useState(inicial);
  const [activas, setActivas] = useState<string[]>(FUENTES.map(f => f.id));
  const [res, setRes] = useState<Record<string, Estado>>({});
  const [guardar, setGuardar] = useState<Borrador | null>(null);
  const [filtro, setFiltro] = useState('todos');

  async function buscar(term: string) {
    if (!term.trim()) return;
    router.replace('/centro/buscar?q=' + encodeURIComponent(term));
    setRes(Object.fromEntries(activas.map(id => [id, { cargando: true, resultados: [] }])));
    await Promise.all(activas.map(async id => {
      try {
        const r = await fetch('/api/buscar?fuente=' + id + '&q=' + encodeURIComponent(term)); const j = await r.json();
        setRes(s => ({ ...s, [id]: { cargando: false, resultados: j.resultados || [], error: j.error, estado: j.estado } }));
      } catch { setRes(s => ({ ...s, [id]: { cargando: false, resultados: [], error: 'Sin conexión con el servidor' } })); }
    }));
  }
  useEffect(() => { if (inicial) buscar(inicial); /* eslint-disable-next-line */ }, []);
  const total = Object.values(res).reduce((n, r) => n + r.resultados.length, 0);
  const visibles = FUENTES.filter(f => res[f.id] && (filtro === 'todos' || f.grupo === filtro));

  return <>
    <header className="page-head"><div><span className="eyebrow">BUSCADOR FEDERADO</span><h1>Una consulta, todos los archivos</h1>
      <p className="lead">Documentos oficiales, prensa, audio, imágenes, mapas y estudios. Lo que sirva lo guardás como evidencia con su fuente y su folio.</p></div></header>
    <form className="search" onSubmit={e => { e.preventDefault(); buscar(q); }}>
      <input value={q} onChange={e => setQ(e.target.value)} placeholder="Ej: Negroponte Mexico 1991, Abelardo Ramos embajador, Condor II…" autoFocus />
      <button className="btn">Buscar</button>
    </form>
    <div className="presets"><span className="muted small">Búsquedas de los expedientes:</span>{expedientes.flatMap(x => x.busquedas.map(b => <button key={x.id + b} className="chip" onClick={() => { setQ(b); buscar(b); }} style={{ borderColor: x.color + '88' }}>{b}</button>))}</div>
    <details className="fuentes-sel"><summary>Fuentes activas ({activas.length}/{FUENTES.length})</summary>
      <div className="chips">{FUENTES.map(f => <button key={f.id} className={'chip ' + (activas.includes(f.id) ? 'on' : '')} onClick={() => setActivas(a => a.includes(f.id) ? a.filter(x => x !== f.id) : [...a, f.id])}>{f.nombre}</button>)}</div>
    </details>

    {Object.keys(res).length > 0 && <div className="tabs">{['todos', ...GRUPOS].map(g => <button key={g} className={filtro === g ? 'on' : ''} onClick={() => setFiltro(g)}>{g === 'todos' ? `Todo (${total})` : g}</button>)}</div>}

    <div className="results">
      {visibles.map(f => { const r = res[f.id]; return <section key={f.id} className="prov">
        <div className="prov-head"><b>{f.nombre}</b><span className="muted small">{f.grupo}</span>{r.cargando ? <span className="spin">consultando…</span> : <span className="count">{r.resultados.length}</span>}</div>
        {r.error && <p className={'note ' + (r.estado === 'not_configured' ? '' : 'err')}>{r.error}</p>}
        {!r.cargando && !r.error && r.resultados.length === 0 && <p className="muted small">Sin resultados para esta consulta.</p>}
        {r.resultados.map((x, i) => <article key={i} className="hit">
          {x.imagen && <img src={x.imagen} alt="" loading="lazy" onError={e => (e.currentTarget.style.display = 'none')} />}
          <div><a href={x.url} target="_blank" rel="noreferrer" className="hit-t">{x.titulo}</a>
            <div className="hit-m">{[x.formato, x.fecha, x.autor].filter(Boolean).join(' · ')}</div>
            {x.descripcion && <p>{x.descripcion}</p>}
            <button className="btn small ghost" onClick={() => setGuardar({ titulo: x.titulo, url: x.url, origen: f.nombre, formato: x.formato, fechaDoc: x.fecha })}>+ Guardar como evidencia</button></div>
        </article>)}
      </section>; })}
    </div>

    <section className="card">
      <div className="card-head"><h2>Archivos sin API pública · búsqueda directa</h2></div>
      <p className="muted small">Estos archivos no tienen API abierta. El enlace abre su buscador con tu consulta; lo que encuentres lo cargás a mano en Evidencias.</p>
      <div className="direct">{DIRECTOS(q || 'Abelardo Ramos Negroponte').map(([n, u]) => <a key={n} href={u} target="_blank" rel="noreferrer">{n} ↗</a>)}</div>
    </section>
    {guardar && <GuardarEvidencia base={guardar} onClose={() => setGuardar(null)} />}
  </>;
}

export default function Page() { return <Suspense><Buscador /></Suspense>; }
