'use client';
import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { E, F, entidades, evidenciaInfo, expedientes, hechos, tipoInfo, vinculos, X, type Evidencia, type Vinculo } from '@/data/caso';
import { Avatar, Badge, fechaLarga } from '@/components/ui';
import { useEvidencias } from '@/lib/store';

function iniciales(n: string) {
  const t = n.split(' ').filter(w => /^[A-ZÁÉÍÓÚ]/.test(w)).slice(0, 2).map(w => w[0]).join('');
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect width="100" height="100" fill="#1c2e42"/><text x="50" y="62" font-family="Georgia" font-size="36" fill="#d0a85c" text-anchor="middle">${t}</text></svg>`);
}
type Arista = Vinculo & { usuario?: boolean; url?: string };

function Red() {
  const sp = useSearchParams();
  const evIni = sp.get('ev') as Evidencia | null;
  const [evs, setEvs] = useState<Evidencia[]>(evIni ? [evIni] : ['documentado', 'contexto', 'hipotesis']);
  const [exp, setExp] = useState(sp.get('exp') || '');
  const [sel, setSel] = useState<string>(sp.get('actor') || 'ramos');
  const [edgeSel, setEdgeSel] = useState<Arista | null>(null);
  const { items } = useEvidencias();
  const box = useRef<HTMLDivElement>(null); const net = useRef<any>(null);

  const aristas: Arista[] = useMemo(() => [
    ...vinculos,
    ...items.filter(i => i.vinculo).map(i => ({ de: i.vinculo!.de, a: i.vinculo!.a, etiqueta: i.vinculo!.etiqueta, evidencia: (i.clasificacion === 'hecho' ? 'documentado' : i.clasificacion === 'hipotesis' ? 'hipotesis' : 'contexto') as Evidencia, usuario: true, url: i.url, nota: i.nota }))
  ], [items]);

  const visibles = useMemo(() => {
    const foco = exp ? new Set(X[exp].actores) : null;
    return aristas.filter(a => evs.includes(a.evidencia) && (!foco || foco.has(a.de) || foco.has(a.a)));
  }, [aristas, evs, exp]);

  useEffect(() => {
    let cancel = false;
    (async () => {
      const { Network, DataSet } = await import('vis-network/standalone');
      if (cancel || !box.current) return;
      const usados = new Set(visibles.flatMap(a => [a.de, a.a]));
      const foco = exp ? new Set(X[exp].actores) : null;
      const nodes = new DataSet(entidades.filter(e => usados.has(e.id)).map(e => {
        const t = tipoInfo[e.tipo]; const deg = visibles.filter(a => a.de === e.id || a.a === e.id).length;
        const dim = foco && !foco.has(e.id);
        return { id: e.id, label: e.nombre, title: e.rol, shape: e.tipo === 'persona' ? (e.imagen ? 'circularImage' : 'dot') : t.shape, image: e.imagen, brokenImage: e.imagen ? iniciales(e.nombre) : undefined,
          size: e.tipo === 'persona' ? 18 + deg * 2.2 : 12 + deg * 1.4,
          color: { background: dim ? '#1a2532' : '#122030', border: dim ? '#2a3b4d' : t.color, highlight: { background: '#1c2e42', border: '#f2d590' } },
          font: { color: dim ? '#53616f' : '#eee7d8', size: e.tipo === 'persona' ? 22 : 17, face: 'DM Sans', strokeWidth: 4, strokeColor: '#0a111a' },
          borderWidth: e.id === 'ramos' || e.id === 'negroponte' ? 4 : 2, margin: e.tipo === 'institucion' ? { top: 7, bottom: 7, left: 9, right: 9 } : undefined };
      }) as any);
      const edges = new DataSet(visibles.map((a, i) => {
        const c = a.usuario ? '#e6c46f' : evidenciaInfo[a.evidencia].color;
        return { id: i, from: a.de, to: a.a, label: a.evidencia === 'contexto' && !a.usuario ? undefined : a.etiqueta, title: a.etiqueta,
          color: { color: c + (a.evidencia === 'contexto' ? '77' : 'dd'), highlight: '#f2d590' },
          width: a.evidencia === 'documentado' ? 3 : a.evidencia === 'hipotesis' ? 2.2 : 1.2,
          dashes: a.evidencia === 'hipotesis' ? [7, 6] : a.evidencia === 'contexto' ? [2, 4] : false,
          font: { color: c, size: 14, strokeWidth: 4, strokeColor: '#0a111a', align: 'middle' }, smooth: { type: 'dynamic' }, arrows: { to: { enabled: a.evidencia === 'hipotesis', scaleFactor: .5 } } };
      }) as any);
      net.current?.destroy();
      net.current = new Network(box.current, { nodes, edges } as any, {
        physics: { solver: 'forceAtlas2Based', forceAtlas2Based: { gravitationalConstant: -80, springLength: 120, avoidOverlap: .6 }, stabilization: { iterations: 250 } },
        interaction: { hover: true, tooltipDelay: 120 }, nodes: { shapeProperties: { useBorderWithImage: true } },
      });
      net.current.on('click', (p: any) => {
        if (p.nodes[0]) { setSel(p.nodes[0]); setEdgeSel(null); }
        else if (p.edges[0] !== undefined) setEdgeSel(visibles[p.edges[0]]);
      });
      net.current.once('stabilizationIterationsDone', () => { try { if (sel && usados.has(sel)) net.current.selectNodes([sel]); } catch {} });
    })();
    return () => { cancel = true; };
    // eslint-disable-next-line
  }, [visibles, exp]);
  useEffect(() => () => net.current?.destroy(), []);

  const e = E[sel]; const rel = aristas.filter(a => a.de === sel || a.a === sel);
  const hs = hechos.filter(h => h.actores.includes(sel));

  return <>
    <header className="page-head"><div><span className="eyebrow">RED DE RELACIONES</span><h1>Quién se vincula con quién, y con qué prueba</h1>
      <p className="lead">Línea llena: documento primario. Punteada fina: contexto institucional. Raya roja con flecha: hipótesis a probar. Dorado: vínculos que agregaste vos desde tus evidencias.</p></div></header>
    <div className="toolbar">
      {(Object.keys(evidenciaInfo) as Evidencia[]).map(k => <label key={k} className="chk" style={{ color: evidenciaInfo[k].color }}><input type="checkbox" checked={evs.includes(k)} onChange={() => setEvs(s => s.includes(k) ? s.filter(x => x !== k) : [...s, k])} />{evidenciaInfo[k].label} ({aristas.filter(a => a.evidencia === k).length})</label>)}
      <select value={exp} onChange={e => setExp(e.target.value)}><option value="">Todos los expedientes</option>{expedientes.map(x => <option key={x.id} value={x.id}>{x.codigo} · {x.titulo}</option>)}</select>
      <span className="muted small">{visibles.length} vínculos visibles</span>
    </div>
    <div className="net-wrap">
      <div ref={box} className="net" />
      <aside className="net-side">
        {edgeSel ? <>
          <span className="eyebrow">VÍNCULO</span><h3>{E[edgeSel.de].nombre} — {E[edgeSel.a].nombre}</h3>
          <Badge ev={edgeSel.evidencia} />{edgeSel.usuario && <span className="badge" style={{ color: '#e6c46f' }}>tu evidencia</span>}
          <p>{edgeSel.etiqueta}{edgeSel.fecha && <> · <span className="mono">{edgeSel.fecha}</span></>}</p>{edgeSel.nota && <p className="muted">{edgeSel.nota}</p>}
          {edgeSel.fuentes?.map(f => <a key={f} className="src" href={F[f].url} target="_blank" rel="noreferrer">{F[f].titulo} ↗</a>)}
          {edgeSel.url && <a className="src" href={edgeSel.url} target="_blank" rel="noreferrer">Documento guardado ↗</a>}
          <button className="btn small ghost" onClick={() => setEdgeSel(null)}>← volver al actor</button>
        </> : e && <>
          <div className="who"><Avatar id={sel} size={64} /><div><h3>{e.nombre}</h3><small>{e.rol}{e.periodo && ' · ' + e.periodo}</small></div></div>
          <span className="tag" style={{ color: tipoInfo[e.tipo].color }}>{tipoInfo[e.tipo].label}</span>
          {e.bio && <p>{e.bio}</p>}
          <h4>Vínculos ({rel.length})</h4>
          <ul className="rel">{rel.map((a, i) => { const otro = a.de === sel ? a.a : a.de; return <li key={i}><button onClick={() => setSel(otro)}>{E[otro].nombre}</button> <span>{a.etiqueta}</span> <Badge ev={a.evidencia} /></li>; })}</ul>
          {hs.length > 0 && <><h4>Aparece en</h4><ul className="rel">{hs.map(h => <li key={h.id}><span className="mono">{fechaLarga(h.fecha)}</span> {h.titulo}</li>)}</ul></>}
          <Link className="btn small" href={'/centro/buscar?q=' + encodeURIComponent(e.buscar || e.nombre)}>Investigar en archivos ⌕</Link>
          {e.imagenFuente && <a className="muted small" href={e.imagenFuente} target="_blank" rel="noreferrer" style={{ display: 'block', marginTop: 10 }}>Crédito de la imagen ↗</a>}
        </>}
      </aside>
    </div>
    <div className="legend">{Object.entries(tipoInfo).map(([k, t]) => <span key={k}><i style={{ background: t.color }} />{t.label}</span>)}</div>
  </>;
}
export default function Page() { return <Suspense><Red /></Suspense>; }
