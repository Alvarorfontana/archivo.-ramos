'use client';
import Link from 'next/link';

const people = [
  { name: 'Jorge Abelardo Ramos', role: 'Argentina · política exterior', image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Jorge_Abelardo_Ramos.JPG' },
  { name: 'Carlos Menem', role: 'Argentina · Presidencia', image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Carlos_menem.jpg' },
  { name: 'Carlos Salinas de Gortari', role: 'México · Presidencia', image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Carlos_Salinas_de_Gortari_en_1989.jpeg' },
  { name: 'George H. W. Bush', role: 'Estados Unidos · Presidencia', image: 'https://commons.wikimedia.org/wiki/Special:FilePath/George_H._W._Bush_presidential_portrait.jpg' },
  { name: 'John D. Negroponte', role: 'Estados Unidos · diplomacia', image: 'https://commons.wikimedia.org/wiki/Special:FilePath/John_Negroponte_official_portrait.jpg' },
];

const desks = [
  { n: '01', title: 'Archivo documental', text: 'Fuentes primarias, registros oficiales y repositorios institucionales.', href: '/archivo-workbench.html?workspace=1#archive', label: 'DOCUMENTOS' },
  { n: '02', title: 'Red de relaciones', text: 'Actores, instituciones y vínculos clasificados por calidad de evidencia.', href: '/archivo-workbench.html?workspace=1#relations', label: 'PROSOPOGRAFÍA' },
  { n: '03', title: 'Atlas geopolítico', text: 'Territorios, sedes diplomáticas, archivos y acontecimientos.', href: '/archivo-workbench.html?workspace=1#atlas', label: 'GEOGRAFÍA' },
  { n: '04', title: 'Informes de investigación', text: 'Dossiers, cronologías y análisis con referencias rastreables.', href: '/archivo-workbench.html?workspace=1#reports', label: 'ANÁLISIS' },
];

export default function Home() {
  return <main className="archive-v2">
    <header className="av2-header">
      <Link href="/" className="av2-brand"><span className="av2-monogram">89</span><span><b>1989 / ARCHIVE</b><small>INSTITUTO DE INVESTIGACIÓN HISTÓRICA</small></span></Link>
      <div className="av2-header-center">ARGENTINA <i/> MÉXICO <i/> ESTADOS UNIDOS</div>
      <a className="av2-header-link" href="/archivo-workbench.html?workspace=1">ABRIR ARCHIVO <span>↗</span></a>
    </header>

    <section className="av2-hero">
      <div className="av2-hero-image" role="img" aria-label="Fotografía histórica de la caída del Muro de Berlín en 1989"/>
      <div className="av2-hero-overlay"/>
      <div className="av2-hero-content">
        <div className="av2-kicker"><span/> DOSSIER HISTÓRICO · 1983—1995</div>
        <p className="av2-overline">EL PODER DETRÁS DE LA DIPLOMACIA</p>
        <h1>Las relaciones<br/><em>que hicieron</em><br/>la historia.</h1>
        <p className="av2-deck">Argentina, México y Estados Unidos en el final de la Guerra Fría y la transformación del orden internacional. Una investigación documental sobre decisiones, protagonistas, instituciones y redes de poder.</p>
        <div className="av2-hero-actions"><Link href="/archivo-workbench.html?workspace=1" className="av2-primary">ENTRAR AL CENTRO DE INVESTIGACIÓN <span>↗</span></Link><a href="#metodo" className="av2-secondary">CONOCER EL PROYECTO ↓</a></div>
      </div>
      <div className="av2-hero-index"><b>1989</b><span>UN AÑO BISAGRA</span><i/> <span>ARCHIVO · EVIDENCIA · CONTEXTO</span></div>
      <div className="av2-photo-credit">BERLÍN, NOVIEMBRE DE 1989 · IMAGEN DE CONTEXTO HISTÓRICO</div>
    </section>

    <section className="av2-stats" aria-label="Alcance de la investigación">
      <div><b>1983—1995</b><span>VENTANA HISTÓRICA</span></div><div><b>03</b><span>PAÍSES CENTRALES</span></div><div><b>05</b><span>FIGURAS DE REFERENCIA</span></div><div><b>01</b><span>ARCHIVO INTEGRADO</span></div>
    </section>

    <section className="av2-method" id="metodo">
      <div className="av2-section-intro"><span className="av2-section-no">A / EL PROYECTO</span><h2>Investigar no es<br/><em>acumular documentos.</em></h2></div>
      <div className="av2-method-copy"><p>Es establecer qué ocurrió, quién intervino, qué instituciones participaron y qué evidencia permite sostener cada afirmación. El archivo organiza materiales y relaciones sin confundir hechos documentados, contexto e hipótesis.</p><div className="av2-principles"><span>01 · FUENTES PRIMARIAS</span><span>02 · TRAZABILIDAD</span><span>03 · CONTRASTE DOCUMENTAL</span></div></div>
    </section>

    <section className="av2-desks">
      <div className="av2-section-head"><div><span className="av2-section-no">B / HERRAMIENTAS DE TRABAJO</span><h2>Cuatro puertas al archivo.</h2></div><p>Un entorno único para consultar, relacionar, ubicar y analizar la documentación del período.</p></div>
      <div className="av2-desk-grid">{desks.map(d=><Link href={d.href} className="av2-desk" key={d.n}><div className="av2-desk-top"><span>{d.n}</span><small>{d.label}</small></div><h3>{d.title}</h3><p>{d.text}</p><div className="av2-desk-arrow">EXPLORAR <b>↗</b></div></Link>)}</div>
    </section>

    <section className="av2-people">
      <div className="av2-section-head"><div><span className="av2-section-no">C / ACTORES BAJO ESTUDIO</span><h2>Los protagonistas.</h2></div><p>La inclusión en esta selección identifica actores relevantes para la investigación; no presupone vínculos personales ni participación en un mismo acontecimiento.</p></div>
      <div className="av2-people-grid">{people.map((p,i)=><article className="av2-person" key={p.name}><div className="av2-person-image"><img src={p.image} alt={'Retrato de '+p.name} loading="lazy"/><span>0{i+1}</span></div><b>{p.name}</b><small>{p.role}</small></article>)}</div>
    </section>

    <footer className="av2-footer"><div className="av2-brand"><span className="av2-monogram">89</span><span><b>1989 / ARCHIVE</b><small>ARCHIVO HISTÓRICO DIGITAL</small></span></div><p>Investigación documental · Argentina / México / Estados Unidos · 1983—1995</p><Link href="/archivo-workbench.html?workspace=1">ACCEDER AL ARCHIVO ↗</Link></footer>
  </main>;
}
