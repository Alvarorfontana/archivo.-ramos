import Link from 'next/link';
import { entidades, expedientes, fuentes, hechos, vinculos } from '@/data/caso';
import { Avatar } from '@/components/ui';

// Proyección simple (equirectangular) para la tapa.
const P = (lat: number, lng: number) => [(lng + 130) * 6.2, (60 - lat) * 6.2] as const;
const NODOS = [
  { n: 'WASHINGTON', s: 'Bush · Departamento de Estado', lat: 38.9, lng: -77.0 },
  { n: 'CIUDAD DE MÉXICO', s: 'Ramos · Negroponte · Salinas', lat: 19.43, lng: -99.13 },
  { n: 'BUENOS AIRES', s: 'Menem · Cancillería', lat: -34.6, lng: -58.38 },
];

export default function Tapa() {
  const pts = NODOS.map(n => P(n.lat, n.lng));
  const curva = (a: readonly [number, number], b: readonly [number, number], k = .25) => { const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2; return `M${a[0]},${a[1]} Q${mx - (b[1] - a[1]) * k},${my + (b[0] - a[0]) * k} ${b[0]},${b[1]}`; };
  const personas = ['ramos', 'negroponte', 'menem', 'bush', 'salinas'];
  return <main className="tapa">
    <header className="tapa-top">
      <Link href="/" className="brand"><span className="seal">89</span><span><b>1989 / ARCHIVE</b><small>LABORATORIO DE INVESTIGACIÓN HISTÓRICA</small></span></Link>
      <nav><Link href="/centro/expedientes">Expedientes</Link><Link href="/centro/red">Red</Link><Link href="/centro/atlas">Atlas</Link><Link href="/centro" className="btn small">Entrar al centro ↗</Link></nav>
    </header>

    <section className="cover">
      <div className="cover-copy">
        <div className="kicker"><i />EXPEDIENTE ABIERTO · MÉXICO, 1989–1992</div>
        <h1>El embajador<br /><em>que incomodó</em><br />a Washington.</h1>
        <p className="deck">Jorge Abelardo Ramos llegó a México como embajador de Menem. Del otro lado estaba John Negroponte, el hombre de Bush. Esta es una investigación documental sobre ese enfrentamiento y sobre el tablero que lo rodeaba: el alineamiento argentino, el TLC de Salinas, los misiles y los escándalos de 1991.</p>
        <div className="cover-actions"><Link href="/centro" className="btn">Entrar al centro de investigación ↗</Link><Link href="/centro/expedientes/ramos-negroponte" className="btn ghost">Leer el expediente central</Link></div>
      </div>
      <figure className="cover-map" aria-label="Mapa: Washington, Ciudad de México y Buenos Aires unidos por el caso">
        <svg viewBox="0 0 520 640">
          <defs><pattern id="g" width="31" height="31" patternUnits="userSpaceOnUse"><path d="M31 0H0V31" fill="none" stroke="#1f2e3f" strokeWidth="1" /></pattern>
            <radialGradient id="glow"><stop offset="0" stopColor="#d0a85c" stopOpacity=".55" /><stop offset="1" stopColor="#d0a85c" stopOpacity="0" /></radialGradient></defs>
          <rect width="520" height="640" fill="url(#g)" />
          {[-30, 0, 30].map(l => <g key={l}><line x1="0" x2="520" y1={P(l, 0)[1]} y2={P(l, 0)[1]} stroke="#2a3b4d" strokeDasharray="2 6" /><text x="6" y={P(l, 0)[1] - 5} className="coord">{l === 0 ? 'ECUADOR' : Math.abs(l) + '°' + (l > 0 ? 'N' : 'S')}</text></g>)}
          <path className="arc a1" d={curva(pts[0], pts[1], -.3)} /><path className="arc a2" d={curva(pts[1], pts[2], -.25)} /><path className="arc a3" d={curva(pts[0], pts[2], .35)} />
          {NODOS.map((n, i) => <g key={n.n}><circle cx={pts[i][0]} cy={pts[i][1]} r={i === 1 ? 46 : 30} fill="url(#glow)" /><circle cx={pts[i][0]} cy={pts[i][1]} r={i === 1 ? 7 : 5} fill={i === 1 ? '#d0a85c' : '#0b1119'} stroke="#d0a85c" strokeWidth="2" />
            <text x={pts[i][0] + (i !== 0 ? -16 : 14)} y={pts[i][1] - 4} textAnchor={i !== 0 ? 'end' : 'start'} className="city">{n.n}</text><text x={pts[i][0] + (i !== 0 ? -16 : 14)} y={pts[i][1] + 11} textAnchor={i !== 0 ? 'end' : 'start'} className="who">{n.s}</text></g>)}
          <text x="510" y="628" textAnchor="end" className="coord">ESQUEMA · NO A ESCALA</text>
        </svg>
      </figure>
    </section>

    <section className="tapa-stats">
      <div><b>{hechos.length}</b><span>hechos fechados</span></div><div><b>{entidades.length}</b><span>actores e instituciones</span></div>
      <div><b>{vinculos.length}</b><span>vínculos clasificados</span></div><div><b>{fuentes.length}</b><span>fuentes identificadas</span></div><div><b>{expedientes.length}</b><span>expedientes</span></div>
    </section>

    <section className="tapa-sec">
      <div className="sec-head"><span className="eyebrow">LOS PROTAGONISTAS</span><h2>Cinco personas, tres países.</h2></div>
      <div className="people">{personas.map(id => { const e = entidades.find(x => x.id === id)!; return <Link key={id} href={'/centro/red?actor=' + id} className="person"><Avatar id={id} size={92} /><b>{e.nombre}</b><small>{e.rol}</small><small className="mono">{e.periodo}</small></Link>; })}</div>
    </section>

    <section className="tapa-sec">
      <div className="sec-head"><span className="eyebrow">LÍNEAS DE INVESTIGACIÓN</span><h2>Siete expedientes.</h2></div>
      <div className="exp-grid">{expedientes.map(x => <Link key={x.id} href={'/centro/expedientes/' + x.id} className="exp-card" style={{ borderTopColor: x.color }}><span className="code" style={{ color: x.color }}>{x.codigo}</span><h3>{x.titulo}</h3><p className="q">{x.pregunta}</p></Link>)}</div>
    </section>

    <section className="tapa-sec method">
      <div className="sec-head"><span className="eyebrow">MÉTODO</span><h2>Hecho, contexto, hipótesis.</h2></div>
      <p>Cada vínculo y cada hecho dicen con qué se sostienen. Un documento primario no es lo mismo que una coincidencia de cargos, y una sospecha no se dibuja como prueba. El centro de investigación busca en archivos de EE.UU., México y Argentina, en prensa, audio e imágenes, y todo lo que se guarda queda con su fuente y su folio.</p>
    </section>
    <footer className="tapa-foot"><span>1989 / ARCHIVE · Argentina · México · Estados Unidos · 1983–1995</span><Link href="/centro">Centro de investigación ↗</Link></footer>
  </main>;
}
