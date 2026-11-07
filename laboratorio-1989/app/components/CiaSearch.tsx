'use client';
import { useMemo, useState, type FormEvent } from 'react';

const collections = ['A Life in Intelligence - The Richard Helms Collection','A-12 OXCART Reconnaissance Aircraft Documentation','Air America: Upholding the Airmen’s Bond','Atomic Spies: Ethel and Julius Rosenberg'];
const types = ['Cable','Memorandum','Letter','Intelligence Report','Briefing','Telegram','Study','Photograph','Map','Other'];

export default function CiaSearch() {
 const [terms,setTerms]=useState('Argentina AND Menem');
 const [collection,setCollection]=useState<string[]>([]);
 const [title,setTitle]=useState('');
 const [esdn,setEsdn]=useState('');
 const [classification,setClassification]=useState('');
 const [contentType,setContentType]=useState('');
 const [from,setFrom]=useState('1989-01-01');
 const [to,setTo]=useState('1993-12-31');
 const [caseNumber,setCaseNumber]=useState('');
 const [copied,setCopied]=useState(false);
 const [docTitle,setDocTitle]=useState('');
 const [docUrl,setDocUrl]=useState('');
 const [docNotes,setDocNotes]=useState('');
 const [status,setStatus]=useState('');

 const brief=useMemo(()=>[
  'CIA ELECTRONIC READING ROOM · FICHA DE BÚSQUEDA',
  'Texto: '+terms,
  'Colecciones: '+(collection.join('; ')||'Todas'),
  'Título: '+(title||'—'),
  'ESDN: '+(esdn||'—'),
  'Clasificación: '+(classification||'—'),
  'Tipo: '+(contentType||'—'),
  'Fechas: '+from+' a '+to,
  'Caso: '+(caseNumber||'—'),
  'Nota: la búsqueda textual abre el portal CIA. Aplicar allí los filtros de metadatos.'
 ].join('\n'),[terms,collection,title,esdn,classification,contentType,from,to,caseNumber]);

 const searchUrl='https://www.cia.gov/readingroom/search/site/'+encodeURIComponent(terms.trim());
 async function copyBrief(){try{await navigator.clipboard.writeText(brief);setCopied(true)}catch{setCopied(false)}}
 async function register(e:FormEvent){e.preventDefault();setStatus('La ficha quedó preparada. La incorporación al repositorio requiere que el servicio de archivo esté conectado.');}

 return (
  <div className="panel cia-panel">
   <div className="cia-header"><div><span className="eyebrow">FUENTE PRIMARIA · CENTRAL INTELLIGENCE AGENCY</span><h3 className="panel-title">CIA Electronic Reading Room</h3><p className="muted">Búsqueda guiada y ficha de control. No se inventan resultados ni se simula una conexión con el catálogo oficial.</p></div><div className="cia-seal">CIA<br/><small>FOIA</small></div></div>
   <div className="cia-grid">
    <label className="cia-field full">Search terms · Texto completo<input value={terms} onChange={e=>setTerms(e.target.value)} placeholder="Argentina AND Menem"/></label>
    <label className="cia-field full">Colecciones<select multiple value={collection} onChange={e=>setCollection(Array.from(e.target.selectedOptions,o=>o.value))}>{collections.map(x=><option key={x} value={x}>{x}</option>)}</select></label>
    <label className="cia-field">Título del documento<input value={title} onChange={e=>setTitle(e.target.value)}/></label>
    <label className="cia-field">Número / ESDN<input value={esdn} onChange={e=>setEsdn(e.target.value)}/></label>
    <label className="cia-field">Clasificación original<select value={classification} onChange={e=>setClassification(e.target.value)}><option value="">Cualquiera</option><option>Top Secret</option><option>Secret</option><option>Confidential</option><option>Unclassified</option></select></label>
    <label className="cia-field">Tipo de contenido<select value={contentType} onChange={e=>setContentType(e.target.value)}><option value="">Cualquiera</option>{types.map(x=><option key={x}>{x}</option>)}</select></label>
    <label className="cia-field">Desde<input type="date" value={from} onChange={e=>setFrom(e.target.value)}/></label>
    <label className="cia-field">Hasta<input type="date" value={to} onChange={e=>setTo(e.target.value)}/></label>
    <label className="cia-field full">Número de caso<input value={caseNumber} onChange={e=>setCaseNumber(e.target.value)}/></label>
   </div>
   <div className="cia-actions"><a className="cia-submit" href={searchUrl} target="_blank" rel="noreferrer">Buscar en CIA ↗</a><a className="cia-secondary" href="https://www.cia.gov/readingroom/" target="_blank" rel="noreferrer">Advanced Search oficial ↗</a><button className="outline" type="button" onClick={copyBrief}>{copied?'Ficha copiada':'Copiar ficha de filtros'}</button></div>
   <div className="cia-disclaimer">La consulta textual se abre en cia.gov. Los filtros de colección, fechas y clasificación se conservan en esta ficha para aplicarlos en el formulario oficial; no se transmiten como parámetros si el portal no los admite.</div>
   <div className="cia-import"><div className="eyebrow">REGISTRO DE FUENTE VERIFICADA</div><h4>Preparar incorporación al archivo</h4><form className="cia-grid" onSubmit={register}>
    <label className="cia-field full">Título exacto<input required value={docTitle} onChange={e=>setDocTitle(e.target.value)}/></label>
    <label className="cia-field full">URL oficial<input required type="url" value={docUrl} onChange={e=>setDocUrl(e.target.value)}/></label>
    <label className="cia-field full">Notas de verificación<textarea value={docNotes} onChange={e=>setDocNotes(e.target.value)} placeholder="Datos de catálogo, fecha, clasificación y observaciones."/></label>
    <div className="cia-actions full"><button type="submit">Preparar ficha de archivo</button></div>
   </form>{status&&<div className="notice">{status}</div>}</div>
  </div>
 );
}
