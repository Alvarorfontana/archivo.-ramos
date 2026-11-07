'use client';
import Link from 'next/link';
import { use } from 'react';
import { E, F, hechos, vinculos, X } from '@/data/caso';
import { Avatar, Badge, fechaLarga } from '@/components/ui';
import { useEvidencias } from '@/lib/store';

export default function Expediente({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params); const x = X[id]; const { items } = useEvidencias();
  if (!x) return <p>Expediente inexistente. <Link href="/centro/expedientes">Volver</Link></p>;
  const ids = new Set(x.actores);
  const hs = hechos.filter(h => h.expedientes.includes(id)).sort((a, b) => a.fecha.localeCompare(b.fecha));
  const vs = vinculos.filter(v => ids.has(v.de) && ids.has(v.a));
  const mias = items.filter(i => i.expediente === id);
  return <>
    <header className="page-head"><div><span className="eyebrow" style={{ color: x.color }}>{x.codigo} · EXPEDIENTE</span><h1>{x.titulo}</h1><p className="lead"><b>{x.pregunta}</b> {x.resumen}</p></div>
      <div className="head-actions"><Link className="btn" href={'/centro/red?exp=' + id}>Ver en la red</Link><Link className="btn ghost" href={'/centro/informes?exp=' + id}>Redactar informe</Link></div></header>
    <div className="grid-2">
      <section className="card"><div className="card-head"><h2>Actores</h2></div>
        <div className="actors">{x.actores.map(a => <Link key={a} href={'/centro/red?actor=' + a} className="actor"><Avatar id={a} size={40} /><span><b>{E[a].nombre}</b><small>{E[a].rol}</small></span></Link>)}</div>
        <div className="card-head" style={{ marginTop: 16 }}><h2>Vínculos entre ellos</h2></div>
        <ul className="rel">{vs.map((v, i) => <li key={i}><b>{E[v.de].nombre}</b> → <b>{E[v.a].nombre}</b> <span>{v.etiqueta}</span> <Badge ev={v.evidencia} />{v.fuentes?.map(f => <a key={f} href={F[f].url} target="_blank" rel="noreferrer"> ↗</a>)}</li>)}</ul>
      </section>
      <section className="card"><div className="card-head"><h2>Qué falta probar</h2></div>
        <ul className="todo">{x.pendientes.map(p => <li key={p}>{p}</li>)}</ul>
        <div className="card-head" style={{ marginTop: 16 }}><h2>Búsquedas listas</h2></div>
        <div className="chips">{x.busquedas.map(b => <Link key={b} className="chip" href={'/centro/buscar?q=' + encodeURIComponent(b)}>⌕ {b}</Link>)}</div>
      </section>
    </div>
    <section className="card"><div className="card-head"><h2>Hechos del expediente</h2></div>
      <ul className="rel">{hs.map(h => <li key={h.id}><span className="mono">{fechaLarga(h.fecha)}</span> <b>{h.titulo}</b> <Badge ev={h.evidencia} /> <span className="muted">{h.resumen}</span>{h.fuentes?.map(f => <a key={f} href={F[f].url} target="_blank" rel="noreferrer"> {F[f].titulo} ↗</a>)}</li>)}</ul>
    </section>
    <section className="card"><div className="card-head"><h2>Tus evidencias ({mias.length})</h2><Link href="/centro/evidencias">gestionar →</Link></div>
      {mias.length ? <ul className="rel">{mias.map(m => <li key={m.id}><a href={m.url} target="_blank" rel="noreferrer">{m.titulo} ↗</a> <span className="muted">{m.origen}{m.folio && ' · ' + m.folio} · {m.clasificacion}</span></li>)}</ul> : <p className="muted">Ninguna todavía. Lanzá una de las búsquedas listas y guardá lo que sirva.</p>}
    </section>
  </>;
}
