'use client';
import {useMemo,useState} from 'react';

type Actor={id:string;name:string;role:string;period:string;country:string;image:string;imageNote:string;imageSource:string;bio:string;position:{x:number;y:number}};
type Relation={from:string;to:string;kind:'documented'|'context'|'pending';label:string;detail:string;source:string;sourceLabel:string};
const actors:Actor[]=[
{id:'ramos',name:'Jorge Abelardo Ramos',role:'Embajador argentino en México',period:'1990–1992*',country:'ARGENTINA',image:'https://commons.wikimedia.org/wiki/Special:FilePath/JorgeAbelardoRamos1.jpg',imageNote:'Fotografía de 1954 · Archivo Familiar de Jorge Abelardo Ramos · CC0',imageSource:'https://commons.wikimedia.org/wiki/File:JorgeAbelardoRamos1.jpg',bio:'Intelectual, historiador y diplomático argentino. El expediente debe reconstruir su actuación en México mediante nombramientos, correspondencia, agenda y documentos oficiales.',position:{x:145,y:155}},
{id:'negroponte',name:'John Dimitri Negroponte',role:'Embajador de EE.UU. en México',period:'1989–1993',country:'ESTADOS UNIDOS',image:'https://commons.wikimedia.org/wiki/Special:FilePath/John_Negroponte_official_portrait.jpg',imageNote:'Retrato institucional posterior · U.S. Government · dominio público',imageSource:'https://commons.wikimedia.org/wiki/File:John_Negroponte_official_portrait.jpg',bio:'Diplomático estadounidense. Su embajada en México coincide temporalmente con la presidencia de Carlos Salinas de Gortari y con el período de investigación.',position:{x:445,y:92}},
{id:'menem',name:'Carlos Saúl Menem',role:'Presidente de la Nación Argentina',period:'1989–1999',country:'ARGENTINA',image:'https://commons.wikimedia.org/wiki/Special:FilePath/Carlos-menem-1989-crop.jpg',imageNote:'Retrato de asunción · Casa Rosada · CC BY 2.5 Argentina',imageSource:'https://commons.wikimedia.org/wiki/File:Carlos-menem-1989-crop.jpg',bio:'Presidente argentino desde julio de 1989. El expediente debe enlazar decisiones de política exterior y documentación de la designación diplomática de Ramos.',position:{x:145,y:365}},
{id:'bush',name:'George H. W. Bush',role:'Presidente de Estados Unidos',period:'1989–1993',country:'ESTADOS UNIDOS',image:'https://commons.wikimedia.org/wiki/Special:FilePath/George_H._W._Bush_presidential_portrait_(cropped)_(b).jpg',imageNote:'Retrato oficial · 15 febrero 1989 · White House · dominio público',imageSource:'https://commons.wikimedia.org/wiki/File:George_H._W._Bush_presidential_portrait_(cropped)_(b).jpg',bio:'Presidente estadounidense durante el inicio del período. La política hacia América Latina debe reconstruirse con documentos oficiales, no mediante asociaciones automáticas.',position:{x:745,y:165}},
{id:'salinas',name:'Carlos Salinas de Gortari',role:'Presidente de México',period:'1988–1994',country:'MÉXICO',image:'https://commons.wikimedia.org/wiki/Special:FilePath/Carlos_Salinas_de_Gortari_in_1989.jpeg',imageNote:'Fotografía en La Moncloa · 15 julio 1989 · Gobierno de España',imageSource:'https://commons.wikimedia.org/wiki/File:Carlos_Salinas_de_Gortari_in_1989.jpeg',bio:'Presidente mexicano durante el período central de la investigación. Su relación institucional con la embajada estadounidense y las misiones diplomáticas debe documentarse con fuentes primarias.',position:{x:745,y:365}}
];
const relations:Relation[]=[
{from:'ramos',to:'menem',kind:'context',label:'Designación diplomática',detail:'La función de Ramos como embajador debe enlazarse con el decreto de designación, instrucciones de Cancillería y registros de misión. El vínculo institucional está identificado; falta incorporar el documento primario al expediente.',source:'https://www.argentina.gob.ar/normativa',sourceLabel:'Repositorio de normativa argentina'},
{from:'negroponte',to:'salinas',kind:'context',label:'Coincidencia institucional en México · 1989–1993',detail:'Negroponte fue embajador estadounidense en México y Salinas presidente mexicano durante el mismo período. La coincidencia de cargos no prueba por sí misma reuniones, acuerdos ni una relación personal.',source:'https://history.state.gov/departmenthistory/people/negroponte-john-d',sourceLabel:'Office of the Historian · trayectoria de Negroponte'},
{from:'bush',to:'negroponte',kind:'context',label:'Administración estadounidense',detail:'Negroponte ejerció la embajada en México durante la presidencia de George H. W. Bush. El expediente debe recuperar instrucciones, cables y comunicaciones de la administración.',source:'https://history.state.gov/departmenthistory/people/negroponte-john-d',sourceLabel:'Office of the Historian'},
{from:'menem',to:'salinas',kind:'pending',label:'Relación bilateral Argentina–México',detail:'Línea de investigación abierta. No se afirma una reunión ni un acuerdo específico hasta incorporar actas, comunicados, agendas o correspondencia bilateral.',source:'https://catalog.archives.gov/',sourceLabel:'NARA · buscar documentos bilaterales'},
{from:'ramos',to:'salinas',kind:'pending',label:'Actividad de la misión argentina en México',detail:'Cruzar agenda diplomática, actos oficiales, prensa y correspondencia. No atribuir encuentros personales sin una fuente fechada.',source:'https://catalog.archives.gov/',sourceLabel:'NARA · catálogo documental'}
];
const kindLabel={documented:'DOCUMENTO PRIMARIO',context:'CONTEXTO INSTITUCIONAL',pending:'LÍNEA ABIERTA'};
export default function ActorNetwork({onPrepareReport}:{onPrepareReport:(title:string,body:string)=>void}){
 const [selected,setSelected]=useState('ramos');
 const [filter,setFilter]=useState<'all'|'context'|'pending'>('all');
 const actor=actors.find(a=>a.id===selected)||actors[0];
 const visibleRelations=useMemo(()=>relations.filter(r=>(r.from===selected||r.to===selected)&&(filter==='all'||r.kind===filter)),[selected,filter]);
 const connected=new Set(visibleRelations.flatMap(r=>[r.from,r.to]));
 function prepare(){const rows=visibleRelations.map(r=>'- '+r.label+' ['+kindLabel[r.kind]+']: '+r.detail+' Fuente de consulta: '+r.source).join('\n\n');const body='DOSSIER DE ACTOR · 1989 / ARCHIVE\n\nPERSONA: '+actor.name+'\nFUNCIÓN: '+actor.role+'\nPERÍODO: '+actor.period+'\nPAÍS: '+actor.country+'\n\nPERFIL\n'+actor.bio+'\n\nRELACIONES Y LÍNEAS DE INVESTIGACIÓN\n'+(rows||'No hay relaciones visibles con los filtros actuales.')+'\n\nCRITERIO DE EVIDENCIA\nLas coincidencias temporales o institucionales no acreditan por sí solas una relación personal ni causalidad. Las líneas abiertas requieren documentos fechados y localizadores verificables.\n\nFOTOGRAFÍA / PROCEDENCIA\n'+actor.imageNote+' · '+actor.imageSource;onPrepareReport('Dossier de actor — '+actor.name,body)}
 return <div className="actor-workspace">
  <div className="actor-intro"><div><span className="eyebrow">RESEARCH INTELLIGENCE · 01 / ACTORES Y RELACIONES</span><h2>La red de protagonistas</h2><p>Personas, cargos y relaciones para reconstruir la trama diplomática. Seleccioná un rostro para abrir su ficha y seguir las conexiones hasta sus fuentes.</p></div><div className="actor-period"><b>1989—1993</b><small>VENTANA CENTRAL</small></div></div>
  <div className="actor-layout">
   <section className="actor-network-panel">
    <div className="actor-network-head"><span>MAPA DE ACTORES</span><span>05 PROTAGONISTAS · 05 CONEXIONES</span></div>
    <svg className="actor-network-svg" viewBox="0 0 900 470" role="img" aria-label="Red de protagonistas de la investigación 1989 Archive">
     <defs>{actors.map(a=><clipPath id={'clip-'+a.id} key={a.id}><circle cx={a.position.x} cy={a.position.y} r="43"/></clipPath>)}</defs>
     <path className="network-grid" d="M0 117H900 M0 235H900 M0 352H900 M225 0V470 M450 0V470 M675 0V470"/>
     {relations.map((r,i)=>{const a=actors.find(x=>x.id===r.from)!;const b=actors.find(x=>x.id===r.to)!;const mx=(a.position.x+b.position.x)/2;const my=(a.position.y+b.position.y)/2;return <g key={i} className={'edge-group '+r.kind}><path className={'network-edge '+r.kind} d={'M'+a.position.x+' '+a.position.y+' Q'+mx+' '+(my+(i%2?34:-34))+' '+b.position.x+' '+b.position.y}/><text className="edge-label" x={mx} y={my+(i%2?52:-52)} textAnchor="middle">{r.label.length>28?r.label.slice(0,27)+'…':r.label}</text></g>})}
     {actors.map(a=><g key={a.id} onClick={()=>setSelected(a.id)} className={'actor-node '+(selected===a.id?'is-selected':'')+(connected.has(a.id)?' is-connected':'')} role="button" tabIndex={0} aria-label={'Abrir ficha de '+a.name} onKeyDown={e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();setSelected(a.id)}}}>
       <circle className="node-halo" cx={a.position.x} cy={a.position.y} r="51"/><circle className="node-ring" cx={a.position.x} cy={a.position.y} r="46"/>
       <image href={a.image} x={a.position.x-43} y={a.position.y-43} width="86" height="86" preserveAspectRatio="xMidYMid slice" clipPath={'url(#clip-'+a.id+')'}/>
       <text className="actor-node-name" x={a.position.x} y={a.position.y+66} textAnchor="middle">{a.name}</text>
       <text className="actor-node-role" x={a.position.x} y={a.position.y+82} textAnchor="middle">{a.country}</text>
     </g>)}
    </svg>
    <div className="network-legend"><span><i className="legend-solid"/> Relación con registro a localizar</span><span><i className="legend-dash"/> Coincidencia institucional</span><span><i className="legend-open"/> Línea de investigación abierta</span></div>
    <p className="network-warning">La red diferencia hechos, contexto y preguntas abiertas. Ninguna línea representa una alianza, operación o causalidad no acreditada.</p>
   </section>
   <aside className="actor-profile">
    <div className="profile-photo"><img src={actor.image} alt={'Retrato documental de '+actor.name}/><span>RETRATO / PROCEDENCIA</span></div>
    <div className="profile-copy"><span className="eyebrow">{actor.country} · PERFIL DE ACTOR</span><h3>{actor.name}</h3><b>{actor.role}</b><small>{actor.period}</small><p>{actor.bio}</p><a href={actor.imageSource} target="_blank" rel="noreferrer">Ver ficha y derechos de imagen ↗</a><p className="photo-credit">{actor.imageNote}</p></div>
    <div className="profile-actions"><button onClick={prepare}>Preparar dossier de este actor ↗</button></div>
   </aside>
  </div>
  <section className="relation-desk"><div className="relation-head"><div><span className="eyebrow">02 / VÍNCULOS Y EXPEDIENTES</span><h3>Conexiones documentales</h3></div><div className="relation-filters"><button className={filter==='all'?'active':''} onClick={()=>setFilter('all')}>Todas</button><button className={filter==='context'?'active':''} onClick={()=>setFilter('context')}>Contexto</button><button className={filter==='pending'?'active':''} onClick={()=>setFilter('pending')}>Abiertas</button></div></div>
   <div className="relation-list">{visibleRelations.map((r,i)=><article key={i} className={'relation-card '+r.kind}><div className="relation-status">{kindLabel[r.kind]}</div><h4>{r.label}</h4><p>{r.detail}</p><a href={r.source} target="_blank" rel="noreferrer">{r.sourceLabel} ↗</a></article>)}{!visibleRelations.length&&<div className="empty">No hay conexiones para este filtro.</div>}</div>
  </section>
  <section className="report-bridge"><div><span className="eyebrow">03 / PRODUCCIÓN DE CONOCIMIENTO</span><h3>De la red al informe</h3><p>El dossier reúne perfil, vínculos, estado de evidencia y fuentes para continuar la verificación. Después puede ampliarse con documentos incorporados al archivo.</p></div><button onClick={prepare}>Generar borrador de informe</button></section>
 </div>
}
