'use client';
import { useState } from 'react';
import Link from 'next/link';
import { E, F, L, banderas, evidenciaInfo, expedientes, hechos, X, type Evidencia } from '@/data/caso';
import { Badge, fechaLarga } from '@/components/ui';
import { useEvidencias } from '@/lib/store';

export default function Cronologia() {
  const [exp, setExp] = useState(''); const [ev, setEv] = useState<Evidencia | ''>('');
  const { items } = useEvidencias();
  const hs = hechos.filter(h => (!exp || h.expedientes.includes(exp)) && (!ev || h.evidencia === ev)).sort((a, b) => a.fecha.localeCompare(b.fecha));
  const mias = items.filter(i => /^\d{4}/.test(i.fechaDoc || '') && (!exp || i.expediente === exp));
  const filas = [...hs.map(h => ({ k: 'h' as const, fecha: h.fecha, h })), ...mias.map(m => ({ k: 'm' as const, fecha: (m.fechaDoc || '').slice(0, 10), m }))].sort((a, b) => a.fecha.localeCompare(b.fecha));
  let anio = '';
  return <>
    <header className="page-head"><div><span className="eyebrow">CRONOLOGÍA</span><h1>La secuencia, 1981–1994</h1>
      <p className="lead">Hechos fechados del caso y del contexto, con su escenario y su nivel de prueba. Tus evidencias con fecha se intercalan en dorado.</p></div></header>
    <div className="toolbar">
      <select value={exp} onChange={e => setExp(e.target.value)}><option value="">Todos los expedientes</option>{expedientes.map(x => <option key={x.id} value={x.id}>{x.codigo} · {x.titulo}</option>)}</select>
      <select value={ev} onChange={e => setEv(e.target.value as Evidencia)}><option value="">Toda evidencia</option>{Object.entries(evidenciaInfo).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}</select>
    </div>
    <ol className="timeline">{filas.map((f, i) => {
      const y = f.fecha.slice(0, 4); const head = y !== anio; anio = y;
      return <li key={i} className={f.k === 'm' ? 'mine' : ''}>
        {head && <div className="tl-year">{y}</div>}
        {f.k === 'h' ? <div className="tl-item" style={{ borderColor: evidenciaInfo[f.h.evidencia].color }}>
          <div className="tl-date mono">{fechaLarga(f.h.fecha)} · {f.h.lugares.map(l => banderas[L[l].pais] || L[l].nombre).filter((v, j, a) => a.indexOf(v) === j).join(' / ')}</div>
          <b>{f.h.titulo}</b> <Badge ev={f.h.evidencia} />
          <p>{f.h.resumen}</p>
          {f.h.verificar && <p className="note">A verificar: {f.h.verificar}</p>}
          <div className="chips">{f.h.actores.map(a => <Link className="chip" key={a} href={'/centro/red?actor=' + a}>{E[a].nombre}</Link>)}{f.h.expedientes.map(x => <Link className="chip" key={x} href={'/centro/expedientes/' + x} style={{ borderColor: X[x].color }}>{X[x].codigo}</Link>)}</div>
          {f.h.fuentes?.map(s => <a key={s} className="src" href={F[s].url} target="_blank" rel="noreferrer">{F[s].titulo} ↗</a>)}
        </div> : <div className="tl-item" style={{ borderColor: '#e6c46f' }}>
          <div className="tl-date mono">{f.m.fechaDoc} · tu evidencia</div><b>{f.m.titulo}</b><p>{f.m.nota}</p><a className="src" href={f.m.url} target="_blank" rel="noreferrer">{f.m.origen} ↗</a>
        </div>}
      </li>;
    })}</ol>
  </>;
}
