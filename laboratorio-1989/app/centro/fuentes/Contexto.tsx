'use client';
import { useEffect, useState } from 'react';

type Serie = { iso3: string; country: string; values: { year: number; value: number | null }[] };
const COL: Record<string, string> = { ARG: '#7dbbe0', MEX: '#88c09a', USA: '#e07a62', DEU: '#a98bc4' };

function Grafico({ titulo, series, log }: { titulo: string; series: Serie[]; log?: boolean }) {
  const W = 560, H = 220, P = 34; const ss = series.filter(s => s.iso3 !== 'DEU');
  const vals = ss.flatMap(s => s.values.map(v => v.value).filter((v): v is number => v != null));
  if (!vals.length) return null;
  const f = (v: number) => log ? Math.log10(Math.max(v, 0.5)) : v;
  const mn = Math.min(...vals.map(f), 0), mx = Math.max(...vals.map(f));
  const x = (y: number) => P + (y - 1983) / 12 * (W - P - 10); const y = (v: number) => H - P - (f(v) - mn) / (mx - mn || 1) * (H - P - 12);
  const ticks = log ? [1, 10, 100, 1000] : [mn, (mn + mx) / 2, mx];
  return <figure className="chart"><figcaption>{titulo}</figcaption>
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={titulo}>
      <rect x={x(1989)} y={8} width={x(1992) - x(1989)} height={H - P - 8} fill="#d0a85c14" /><text x={x(1989) + 4} y={20} className="ax">gestión Ramos</text>
      {ticks.map(t => <g key={t}><line x1={P} x2={W - 10} y1={y(t)} y2={y(t)} stroke="#2a3b4d" /><text x={P - 4} y={y(t) + 3} textAnchor="end" className="ax">{Math.round(t).toLocaleString('es-AR')}</text></g>)}
      {[1983, 1986, 1989, 1992, 1995].map(a => <text key={a} x={x(a)} y={H - 12} textAnchor="middle" className="ax">{a}</text>)}
      {ss.map(s => <polyline key={s.iso3} fill="none" stroke={COL[s.iso3]} strokeWidth={2.2} points={s.values.filter(v => v.value != null).map(v => x(v.year) + ',' + y(v.value!)).join(' ')} />)}
    </svg>
    <div className="legend">{ss.map(s => <span key={s.iso3}><i style={{ background: COL[s.iso3] }} />{s.country}</span>)}</div>
  </figure>;
}

export default function Contexto() {
  const [d, setD] = useState<any>(null); const [err, setErr] = useState('');
  useEffect(() => { fetch('/api/data/worldbank').then(r => r.json()).then(j => j.error ? setErr(j.error) : setD(j)).catch(() => setErr('No se pudo consultar al Banco Mundial.')); }, []);
  return <section className="card"><div className="card-head"><h2>Contexto económico 1983–1995 · Banco Mundial</h2></div>
    {err && <p className="note err">{err}</p>}{!d && !err && <p className="muted">Cargando series…</p>}
    {d && <div className="grid-2"><Grafico titulo="Inflación anual (%, escala logarítmica)" series={d.inflation.series} log /><Grafico titulo="Crecimiento del PIB (%)" series={d.gdpGrowth.series} /></div>}
    <p className="muted small">Fuente: World Development Indicators, Banco Mundial. Datos consultados en vivo.</p>
  </section>;
}
