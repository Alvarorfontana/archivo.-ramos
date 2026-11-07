'use client';
import 'leaflet/dist/leaflet.css';
import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { E, F, L, entidades, evidenciaInfo, expedientes, hechos, lugares, X, type Hecho } from '@/data/caso';
import { Badge, fechaLarga } from '@/components/ui';

const anioDe = (h: Hecho) => +h.fecha.slice(0, 4);
function arco(a: [number, number], b: [number, number], n = 40): [number, number][] {
  const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2; const dx = b[0] - a[0], dy = b[1] - a[1];
  const c: [number, number] = [mx - dy * .22, my + dx * .22]; const out: [number, number][] = [];
  for (let i = 0; i <= n; i++) { const t = i / n; out.push([(1 - t) ** 2 * a[0] + 2 * (1 - t) * t * c[0] + t * t * b[0], (1 - t) ** 2 * a[1] + 2 * (1 - t) * t * c[1] + t * t * b[1]]); }
  return out;
}

export default function Atlas() {
  const [hasta, setHasta] = useState(1994);
  const [exp, setExp] = useState('');
  const [sel, setSel] = useState<{ tipo: 'lugar' | 'hecho'; id: string }>({ tipo: 'lugar', id: 'cdmx' });
  const [play, setPlay] = useState(false); const [listo, setListo] = useState(false);
  const box = useRef<HTMLDivElement>(null); const map = useRef<any>(null); const capa = useRef<any>(null); const Lf = useRef<any>(null);

  const visibles = useMemo(() => hechos.filter(h => anioDe(h) <= hasta && (!exp || h.expedientes.includes(exp))), [hasta, exp]);

  useEffect(() => {
    let off = false;
    (async () => {
      const L_ = (await import('leaflet')).default; if (off || !box.current || map.current) return;
      Lf.current = L_;
      map.current = L_.map(box.current, { worldCopyJump: true, zoomControl: true, minZoom: 2 }).fitBounds(lugares.map(l => [l.lat, l.lng]) as any, { padding: [30, 30] });
      L_.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', { attribution: '© OpenStreetMap · © CARTO', subdomains: 'abcd', maxZoom: 18 }).addTo(map.current);
      capa.current = L_.layerGroup().addTo(map.current);
      setListo(true);
    })();
    return () => { off = true; };
  }, []);

  useEffect(() => {
    const L_ = Lf.current; if (!L_ || !capa.current) return;
    capa.current.clearLayers();
    visibles.forEach(h => {
      const [p0, ...resto] = h.lugares; const c = evidenciaInfo[h.evidencia].color;
      resto.forEach(p => {
        const line = L_.polyline(arco([L[p0].lat, L[p0].lng], [L[p].lat, L[p].lng]), { color: c, weight: h.evidencia === 'documentado' ? 2.6 : 1.6, opacity: .75, dashArray: h.evidencia === 'hipotesis' ? '6 6' : h.evidencia === 'contexto' ? '2 5' : undefined });
        line.bindTooltip(`<b>${fechaLarga(h.fecha)}</b> · ${h.titulo}`, { sticky: true, className: 'tt' });
        line.on('click', () => setSel({ tipo: 'hecho', id: h.id })); line.addTo(capa.current);
      });
    });
    lugares.forEach(l => {
      const n = visibles.filter(h => h.lugares.includes(l.id)).length; if (!n) return;
      const actores = entidades.filter(e => e.lugar === l.id).length;
      const m = L_.circleMarker([l.lat, l.lng], { radius: 6 + Math.sqrt(n) * 4.5, color: '#d0a85c', weight: 2, fillColor: l.id === 'cdmx' ? '#d0a85c' : '#122030', fillOpacity: l.id === 'cdmx' ? .55 : .85 });
      m.bindTooltip(`<b>${l.nombre}</b><br>${n} hechos · ${actores} actores`, { className: 'tt', direction: 'top' });
      m.on('click', () => setSel({ tipo: 'lugar', id: l.id })); m.addTo(capa.current);
      L_.marker([l.lat, l.lng], { icon: L_.divIcon({ className: 'map-label', html: l.nombre, iconSize: [140, 16], iconAnchor: l.id === 'ezeiza' ? [-10, -8] : l.id === 'bsas' ? [-14, 16] : [-12, 8] }), interactive: false }).addTo(capa.current);
    });
  }, [visibles, listo]);

  useEffect(() => {
    if (!play) return;
    const t = setInterval(() => setHasta(h => { if (h >= 1994) { setPlay(false); return 1994; } return h + 1; }), 1300);
    return () => clearInterval(t);
  }, [play]);

  const lugar = sel.tipo === 'lugar' ? L[sel.id] : null; const hecho = sel.tipo === 'hecho' ? hechos.find(h => h.id === sel.id) : null;
  const hechosLugar = lugar ? visibles.filter(h => h.lugares.includes(lugar.id)) : [];

  return <>
    <header className="page-head"><div><span className="eyebrow">ATLAS GEOPOLÍTICO</span><h1>Dónde pasó, y qué conectó a cada lugar</h1>
      <p className="lead">Cada arco es un hecho que une dos escenarios: Washington con Buenos Aires, Ciudad de México con Washington, Ezeiza con Madrid. El tamaño del punto indica cuántos hechos ocurrieron ahí. Hacé clic en un punto o en un arco.</p></div></header>
    <div className="toolbar">
      <button className="btn small" onClick={() => { if (!play) setHasta(1981); setPlay(p => !p); }}>{play ? '❚❚ Pausa' : '▶ Recorrer 1981–1994'}</button>
      <label className="range">Hasta <b>{hasta}</b><input type="range" min={1981} max={1994} value={hasta} onChange={e => setHasta(+e.target.value)} /></label>
      <select value={exp} onChange={e => setExp(e.target.value)}><option value="">Todos los expedientes</option>{expedientes.map(x => <option key={x.id} value={x.id}>{x.codigo} · {x.titulo}</option>)}</select>
      <span className="muted small">{visibles.length} hechos</span>
    </div>
    <div className="net-wrap">
      <div ref={box} className="net map" />
      <aside className="net-side">
        {lugar && <>
          <span className="eyebrow">LUGAR</span><h3>{lugar.nombre}</h3>{lugar.aproximado && <small className="muted">ubicación aproximada</small>}<p>{lugar.descripcion}</p>
          <h4>Actores situados aquí</h4><div className="chips">{entidades.filter(e => e.lugar === lugar.id).map(e => <Link key={e.id} className="chip" href={'/centro/red?actor=' + e.id}>{e.nombre}</Link>)}</div>
          <h4>Hechos ({hechosLugar.length})</h4>
          <ul className="rel">{hechosLugar.map(h => <li key={h.id}><button onClick={() => setSel({ tipo: 'hecho', id: h.id })}><span className="mono">{fechaLarga(h.fecha)}</span> {h.titulo}</button> <Badge ev={h.evidencia} /></li>)}</ul>
        </>}
        {hecho && <>
          <span className="eyebrow">HECHO · {fechaLarga(hecho.fecha)}</span><h3>{hecho.titulo}</h3><Badge ev={hecho.evidencia} /><p>{hecho.resumen}</p>
          {hecho.verificar && <p className="note">A verificar: {hecho.verificar}</p>}
          <h4>Escenarios</h4><div className="chips">{hecho.lugares.map(l => <button key={l} className="chip" onClick={() => setSel({ tipo: 'lugar', id: l })}>{L[l].nombre}</button>)}</div>
          <h4>Actores</h4><div className="chips">{hecho.actores.map(a => <Link key={a} className="chip" href={'/centro/red?actor=' + a}>{E[a].nombre}</Link>)}</div>
          <h4>Expedientes</h4><div className="chips">{hecho.expedientes.map(x => <Link key={x} className="chip" href={'/centro/expedientes/' + x}>{X[x].codigo} · {X[x].titulo}</Link>)}</div>
          {hecho.fuentes?.map(f => <a key={f} className="src" href={F[f].url} target="_blank" rel="noreferrer">{F[f].titulo} ↗</a>)}
        </>}
      </aside>
    </div>
    <div className="legend">{Object.entries(evidenciaInfo).map(([k, v]) => <span key={k}><i style={{ background: v.color }} />{v.label}</span>)}<span className="muted">Los puntos marcan ciudades e instituciones, no domicilios.</span></div>
  </>;
}
