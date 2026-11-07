'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { E, entidades, expedientes, fuentes, hechos, vinculos, X } from '@/data/caso';
import { Avatar, Badge, fechaLarga } from '@/components/ui';
import { useEvidencias } from '@/lib/store';

export default function Panel() {
  const router = useRouter(); const [q, setQ] = useState('');
  const { items } = useEvidencias();
  const cuenta = (ev: string) => vinculos.filter(v => v.evidencia === ev).length;
  const hip = vinculos.filter(v => v.evidencia === 'hipotesis');
  const anios = [1989, 1990, 1991, 1992, 1993, 1994];
  const porAnio = anios.map(a => hechos.filter(h => h.fecha.startsWith(String(a))).length);
  const max = Math.max(...porAnio);

  return <>
    <header className="page-head">
      <div><span className="eyebrow">MESA DE INVESTIGACIÓN</span><h1>¿Qué enfrentó a Ramos con Negroponte?</h1>
        <p className="lead">Embajadas en México, la Casa Blanca de Bush, la Casa Rosada de Menem y el México de Salinas, 1989–1992. Cada dato marca si está documentado, si es contexto o si sigue siendo hipótesis.</p></div>
      <form className="quick" onSubmit={e => { e.preventDefault(); if (q.trim()) router.push('/centro/buscar?q=' + encodeURIComponent(q)); }}>
        <input value={q} onChange={e => setQ(e.target.value)} placeholder="Buscar en archivos, prensa, audio…" /><button className="btn">Buscar</button>
      </form>
    </header>

    <section className="kpis">
      <div><b>{entidades.length}</b><span>actores e instituciones</span></div>
      <div><b>{hechos.length}</b><span>hechos fechados</span></div>
      <div><b style={{ color: 'var(--ok)' }}>{cuenta('documentado')}</b><span>vínculos documentados</span></div>
      <div><b style={{ color: 'var(--blue)' }}>{cuenta('contexto')}</b><span>de contexto</span></div>
      <div><b style={{ color: 'var(--hip)' }}>{cuenta('hipotesis')}</b><span>hipótesis abiertas</span></div>
      <div><b>{fuentes.filter(f => f.tipo === 'documento' || f.tipo === 'normativa').length}</b><span>documentos primarios</span></div>
      <div><b style={{ color: 'var(--gold)' }}>{items.length}</b><span>mis evidencias</span></div>
    </section>

    <div className="grid-2">
      <section className="card">
        <div className="card-head"><h2>Estado de la prueba por expediente</h2><Link href="/centro/expedientes">ver todos →</Link></div>
        {expedientes.map(x => {
          const ids = new Set(x.actores);
          const vs = vinculos.filter(v => ids.has(v.de) || ids.has(v.a));
          const d = vs.filter(v => v.evidencia === 'documentado').length, c = vs.filter(v => v.evidencia === 'contexto').length, h = vs.filter(v => v.evidencia === 'hipotesis').length;
          const mias = items.filter(i => i.expediente === x.id).length; const tot = d + c + h || 1;
          return <Link href={'/centro/expedientes/' + x.id} key={x.id} className="exp-row">
            <span className="code" style={{ color: x.color }}>{x.codigo}</span>
            <span className="t">{x.titulo}</span>
            <span className="bar"><i style={{ width: d / tot * 100 + '%', background: 'var(--ok)' }} /><i style={{ width: c / tot * 100 + '%', background: 'var(--blue)' }} /><i style={{ width: h / tot * 100 + '%', background: 'var(--hip)' }} /></span>
            <span className="n">{x.pendientes.length} pend. · {mias} mías</span>
          </Link>;
        })}
        <div className="legend"><span><i style={{ background: 'var(--ok)' }} />documentado</span><span><i style={{ background: 'var(--blue)' }} />contexto</span><span><i style={{ background: 'var(--hip)' }} />hipótesis</span></div>
      </section>

      <section className="card">
        <div className="card-head"><h2>Hechos por año</h2><Link href="/centro/cronologia">cronología →</Link></div>
        <div className="years">{anios.map((a, i) => <div key={a}><span style={{ height: (porAnio[i] / max) * 100 + '%' }}><em>{porAnio[i]}</em></span><b>{a}</b></div>)}</div>
        <div className="card-head" style={{ marginTop: 18 }}><h2>Documentos primarios</h2><Link href="/centro/fuentes">fuentes →</Link></div>
        <ul className="doc-list">{fuentes.filter(f => f.tipo === 'documento' || f.tipo === 'normativa').map(f => <li key={f.id}><span className="mono">{fechaLarga(f.fecha)}</span><a href={f.url} target="_blank" rel="noreferrer">{f.titulo} ↗</a><small>{f.institucion}</small></li>)}</ul>
      </section>
    </div>

    <section className="card">
      <div className="card-head"><h2>Hipótesis abiertas · qué falta probar</h2><Link href="/centro/red?ev=hipotesis">verlas en la red →</Link></div>
      <div className="hip-grid">{hip.map((v, i) => <div className="hip" key={i}>
        <div className="hip-who"><Avatar id={v.de} size={30} /><span>→</span><Avatar id={v.a} size={30} /></div>
        <b>{E[v.de].nombre} → {E[v.a].nombre}</b><p>{v.etiqueta}</p>{v.nota && <small>{v.nota}</small>}
        <Link className="btn small ghost" href={'/centro/buscar?q=' + encodeURIComponent((E[v.de].buscar || E[v.de].nombre) + ' ' + (E[v.a].buscar || E[v.a].nombre).split(' ')[0])}>Investigar ⌕</Link>
      </div>)}</div>
    </section>

    <section className="card">
      <div className="card-head"><h2>Últimas evidencias guardadas</h2><Link href="/centro/evidencias">todas →</Link></div>
      {items.length === 0 ? <p className="muted">Todavía no guardaste evidencias. Usá el <Link href="/centro/buscar">buscador</Link>: cada resultado tiene un botón «Guardar como evidencia» que lo suma a la red y a los informes.</p> :
        <ul className="doc-list">{items.slice(0, 6).map(e => <li key={e.id}><span className="mono">{X[e.expediente]?.codigo}</span><a href={e.url} target="_blank" rel="noreferrer">{e.titulo} ↗</a><small>{e.origen} · {e.clasificacion}</small></li>)}</ul>}
    </section>
    <p className="muted small">Leyenda de evidencia: <Badge ev="documentado" /> <Badge ev="contexto" /> <Badge ev="hipotesis" /></p>
  </>;
}
