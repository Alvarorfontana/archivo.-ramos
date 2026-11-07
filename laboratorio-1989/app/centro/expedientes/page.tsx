'use client';
import Link from 'next/link';
import { expedientes, hechos } from '@/data/caso';
import { Avatar } from '@/components/ui';
import { useEvidencias } from '@/lib/store';

export default function Expedientes() {
  const { items } = useEvidencias();
  return <>
    <header className="page-head"><div><span className="eyebrow">EXPEDIENTES</span><h1>Siete líneas de investigación</h1>
      <p className="lead">Cada expediente tiene una pregunta, sus actores, los hechos fechados, lo que falta probar y búsquedas listas para lanzar.</p></div></header>
    <div className="exp-grid">{expedientes.map(x => <Link key={x.id} href={'/centro/expedientes/' + x.id} className="exp-card" style={{ borderTopColor: x.color }}>
      <span className="code" style={{ color: x.color }}>{x.codigo}</span><h3>{x.titulo}</h3><p className="q">{x.pregunta}</p>
      <div className="faces">{x.actores.slice(0, 6).map(a => <Avatar key={a} id={a} size={28} />)}</div>
      <div className="exp-meta"><span>{hechos.filter(h => h.expedientes.includes(x.id)).length} hechos</span><span>{x.pendientes.length} pendientes</span><span>{items.filter(i => i.expediente === x.id).length} evidencias tuyas</span></div>
    </Link>)}</div>
  </>;
}
