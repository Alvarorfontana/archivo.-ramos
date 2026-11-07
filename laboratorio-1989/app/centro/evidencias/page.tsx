'use client';
import { useRef, useState } from 'react';
import { E, expedientes, X } from '@/data/caso';
import { GuardarEvidencia } from '@/components/ui';
import { descargar, useEvidencias, type EvidenciaUsuario } from '@/lib/store';

export default function Evidencias() {
  const { items, borrar, importar, listo } = useEvidencias();
  const [exp, setExp] = useState(''); const [nueva, setNueva] = useState(false); const [url, setUrl] = useState(''); const [tit, setTit] = useState('');
  const [msg, setMsg] = useState(''); const file = useRef<HTMLInputElement>(null);
  const lista = items.filter(i => !exp || i.expediente === exp);

  function onImport(f?: File) {
    if (!f) return; const r = new FileReader();
    r.onload = () => { try { const n = importar(JSON.parse(String(r.result)) as EvidenciaUsuario[]); setMsg(n + ' evidencias importadas.'); } catch { setMsg('El archivo no es un respaldo válido.'); } };
    r.readAsText(f);
  }
  return <>
    <header className="page-head"><div><span className="eyebrow">EVIDENCIAS</span><h1>Tu archivo de prueba</h1>
      <p className="lead">Todo lo que guardaste, con fuente, folio y clasificación. Se guarda en este navegador: exportá un respaldo para pasarlo a otro equipo o no perderlo.</p></div>
      <div className="head-actions">
        <button className="btn" onClick={() => setNueva(true)}>+ Cargar a mano</button>
        <button className="btn ghost" onClick={() => descargar('evidencias-1989-' + new Date().toISOString().slice(0, 10) + '.json', JSON.stringify(items, null, 2))} disabled={!items.length}>Exportar respaldo</button>
        <button className="btn ghost" onClick={() => file.current?.click()}>Importar</button>
        <input ref={file} type="file" accept="application/json" hidden onChange={e => onImport(e.target.files?.[0])} />
      </div></header>
    {msg && <p className="note">{msg}</p>}
    {nueva && !tit && <div className="card"><div className="row2"><label>Enlace del documento, audio o nota<input value={url} onChange={e => setUrl(e.target.value)} placeholder="https://…" /></label><label>Título<input id="t" placeholder="Ej: Cable embajada EE.UU. México, 12/3/1991" onKeyDown={e => { if (e.key === 'Enter') setTit((e.target as HTMLInputElement).value); }} /></label></div>
      <button className="btn small" onClick={() => setTit((document.getElementById('t') as HTMLInputElement).value || 'Documento sin título')}>Continuar</button> <button className="btn small ghost" onClick={() => setNueva(false)}>Cancelar</button></div>}
    {nueva && tit && <GuardarEvidencia base={{ titulo: tit, url: url || '#', origen: 'Carga manual' }} onClose={() => { setNueva(false); setTit(''); setUrl(''); }} />}
    <div className="toolbar"><select value={exp} onChange={e => setExp(e.target.value)}><option value="">Todos los expedientes</option>{expedientes.map(x => <option key={x.id} value={x.id}>{x.codigo} · {x.titulo}</option>)}</select><span className="muted small">{lista.length} evidencias</span></div>
    {listo && !lista.length && <p className="muted">Sin evidencias todavía.</p>}
    <div className="ev-list">{lista.map(e => <article key={e.id} className={'ev ' + e.clasificacion}>
      <div className="ev-top"><span className="code" style={{ color: X[e.expediente]?.color }}>{X[e.expediente]?.codigo}</span><span className="tag">{e.clasificacion === 'hecho' ? 'Hecho documentado' : e.clasificacion === 'hipotesis' ? 'Hipótesis' : 'Interpretación'}</span><span className="muted small">{e.origen}{e.fechaDoc && ' · ' + e.fechaDoc}{e.folio && ' · ' + e.folio}</span></div>
      <a href={e.url} target="_blank" rel="noreferrer" className="hit-t">{e.titulo} ↗</a>
      {e.nota && <p>{e.nota}</p>}
      {(e.actores.length > 0 || e.vinculo) && <div className="chips">{e.actores.map(a => <span key={a} className="chip">{E[a]?.nombre}</span>)}{e.vinculo && <span className="chip on">{E[e.vinculo.de]?.nombre} ↔ {E[e.vinculo.a]?.nombre}: {e.vinculo.etiqueta}</span>}</div>}
      <button className="btn small ghost" onClick={() => { if (confirm('¿Borrar esta evidencia?')) borrar(e.id); }}>Borrar</button>
    </article>)}</div>
  </>;
}
