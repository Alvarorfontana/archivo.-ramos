import { fuentes } from '@/data/caso';
import Contexto from './Contexto';

const ARCHIVOS: [string, string, string, string][] = [
  // nombre, qué tiene, acceso, url
  ['FRUS · Office of the Historian', 'Volúmenes de política exterior de EE.UU.', 'API pública · conectada', 'https://history.state.gov/historicaldocuments'],
  ['NARA · National Archives', 'Cables, registros del NSC, bibliotecas presidenciales', 'API gratuita con clave · conectada (falta clave)', 'https://catalog.archives.gov'],
  ['Biblioteca Presidencial Bush', 'Memcons y telcons 1989–1993', 'Web · enlaces directos', 'https://www.bush41library.gov/digital-research-room'],
  ['CIA · FOIA Reading Room', 'Documentos desclasificados (Cóndor, Argentina, México)', 'Web · búsqueda directa', 'https://www.cia.gov/readingroom/'],
  ['Departamento de Estado · FOIA', 'Cables desclasificados', 'Web · búsqueda directa', 'https://foia.state.gov'],
  ['National Security Archive', 'Colecciones desclasificadas (Cono Sur, México)', 'Web · búsqueda directa', 'https://nsarchive.gwu.edu'],
  ['ADST · historias orales', 'Testimonios de diplomáticos de EE.UU.', 'Web', 'https://adst.org/oral-history/'],
  ['Internet Archive', 'Prensa digitalizada, libros, audios y videos', 'API pública · conectada', 'https://archive.org'],
  ['Library of Congress', 'Prensa, mapas, fotografías', 'API pública · conectada', 'https://www.loc.gov'],
  ['Wikimedia Commons', 'Fotografías y mapas con licencia', 'API pública · conectada', 'https://commons.wikimedia.org'],
  ['Wikidata', 'Cargos, fechas y relaciones de personas e instituciones', 'API pública · conectada', 'https://www.wikidata.org'],
  ['OpenAlex y Crossref', 'Libros y artículos académicos', 'API pública · conectada', 'https://openalex.org'],
  ['Archivo Histórico de Cancillería (AR)', 'Correspondencia diplomática argentina', 'Consulta presencial / pedido', 'https://www.google.com/search?q=Archivo+Hist%C3%B3rico+Canciller%C3%ADa+argentina'],
  ['Acervo Histórico Diplomático SRE (MX)', 'Archivo de la cancillería mexicana', 'Consulta presencial / pedido', 'https://acervo.sre.gob.mx'],
  ['Archivo General de la Nación (AR)', 'Fondos del Estado argentino', 'Web / presencial', 'https://www.google.com/search?q=Archivo+General+de+la+Naci%C3%B3n+Argentina'],
  ['Hemeroteca Nacional Digital de México', 'Prensa mexicana digitalizada', 'Web · búsqueda directa', 'https://hndm.iib.unam.mx'],
  ['Revista Proceso', 'Archivo del semanario mexicano', 'Web · búsqueda directa', 'https://www.proceso.com.mx'],
  ['Archivo Nacional de la Memoria (AR)', 'Fotografía de la presidencia de Menem', 'Web', 'https://catalogo.jus.gob.ar'],
];

export default function Fuentes() {
  return <>
    <header className="page-head"><div><span className="eyebrow">FUENTES Y ARCHIVOS</span><h1>Dónde está la prueba</h1>
      <p className="lead">Qué archivo tiene qué, y cómo se accede. «Conectada» significa que el buscador la consulta sola; el resto se abre con tu búsqueda ya cargada.</p></div></header>
    <section className="card"><div className="card-head"><h2>Archivos y repositorios</h2></div>
      <table className="tbl"><thead><tr><th>Archivo</th><th>Qué tiene</th><th>Acceso</th></tr></thead><tbody>
        {ARCHIVOS.map(([n, q, a, u]) => <tr key={n}><td><a href={u} target="_blank" rel="noreferrer">{n} ↗</a></td><td>{q}</td><td className={a.includes('conectada') ? 'ok' : 'muted'}>{a}</td></tr>)}
      </tbody></table></section>
    <section className="card"><div className="card-head"><h2>Documentos ya identificados</h2></div>
      <table className="tbl"><thead><tr><th>Fecha</th><th>Documento</th><th>Tipo</th><th>Institución</th></tr></thead><tbody>
        {fuentes.map(f => <tr key={f.id}><td className="mono">{f.fecha || '—'}</td><td><a href={f.url} target="_blank" rel="noreferrer">{f.titulo} ↗</a></td><td>{f.tipo}</td><td>{f.institucion}</td></tr>)}
      </tbody></table></section>
    <Contexto />
  </>;
}
