'use client';
import { useState } from 'react';
import { E, entidades, evidenciaInfo, expedientes, type Evidencia } from '@/data/caso';
import { useEvidencias, type Clasificacion } from '@/lib/store';

export function Avatar({ id, size = 44 }: { id: string; size?: number }) {
  const e = E[id]; const [fail, setFail] = useState(false);
  const ini = (e?.nombre || '?').split(' ').filter(w => w[0] === w[0]?.toUpperCase()).slice(0, 2).map(w => w[0]).join('');
  return <span className="avatar" style={{ width: size, height: size, fontSize: size * .36 }}>
    {e?.imagen && !fail ? <img src={e.imagen} alt={e.nombre} onError={() => setFail(true)} loading="lazy" /> : ini}
  </span>;
}

export function Badge({ ev }: { ev: Evidencia }) {
  const i = evidenciaInfo[ev];
  return <span className="badge" style={{ color: i.color, borderColor: i.color + '66' }} title={i.desc}>{i.label}</span>;
}

export function fechaLarga(f?: string) {
  if (!f) return '';
  const m = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
  const [y, mo, d] = f.split('-');
  if (d) return `${+d} ${m[+mo - 1]} ${y}`; if (mo) return `${m[+mo - 1]} ${y}`; return y;
}

export interface Borrador { titulo: string; url: string; origen: string; formato?: string; fechaDoc?: string; }

export function GuardarEvidencia({ base, onClose }: { base: Borrador; onClose: () => void }) {
  const { agregar } = useEvidencias();
  const [f, setF] = useState({ titulo: base.titulo, clasificacion: 'hecho' as Clasificacion, expediente: expedientes[0].id, actores: [] as string[], folio: '', nota: '', de: '', a: '', etiqueta: '' });
  const [ok, setOk] = useState(false);
  const toggle = (id: string) => setF(s => ({ ...s, actores: s.actores.includes(id) ? s.actores.filter(x => x !== id) : [...s.actores, id] }));
  function guardar() {
    agregar({ ...base, titulo: f.titulo, clasificacion: f.clasificacion, expediente: f.expediente, actores: f.actores, folio: f.folio, nota: f.nota, vinculo: f.de && f.a && f.de !== f.a ? { de: f.de, a: f.a, etiqueta: f.etiqueta || 'vinculado por documento' } : undefined });
    setOk(true); setTimeout(onClose, 900);
  }
  return <div className="modal-bg" onClick={onClose}><div className="modal" onClick={e => e.stopPropagation()} role="dialog" aria-label="Guardar como evidencia">
    <div className="modal-head"><span className="eyebrow">GUARDAR COMO EVIDENCIA</span><button className="x" onClick={onClose} aria-label="Cerrar">×</button></div>
    {ok ? <p className="ok-msg">Guardada. Ya aparece en Evidencias, en la red y en los informes.</p> : <>
      <label>Título<input value={f.titulo} onChange={e => setF({ ...f, titulo: e.target.value })} /></label>
      <p className="muted small">{base.origen} · <a href={base.url} target="_blank" rel="noreferrer">abrir original ↗</a></p>
      <div className="row2">
        <label>Clasificación<select value={f.clasificacion} onChange={e => setF({ ...f, clasificacion: e.target.value as Clasificacion })}><option value="hecho">Hecho documentado</option><option value="interpretacion">Interpretación</option><option value="hipotesis">Hipótesis</option></select></label>
        <label>Expediente<select value={f.expediente} onChange={e => setF({ ...f, expediente: e.target.value })}>{expedientes.map(x => <option key={x.id} value={x.id}>{x.codigo} · {x.titulo}</option>)}</select></label>
      </div>
      <div className="lbl">Actores que menciona</div>
      <div className="chips">{entidades.filter(x => x.tipo === 'persona' || x.tipo === 'institucion').map(x => <button key={x.id} type="button" className={'chip ' + (f.actores.includes(x.id) ? 'on' : '')} onClick={() => toggle(x.id)}>{x.nombre}</button>)}</div>
      <div className="lbl">¿El documento prueba un vínculo? (se dibuja en la red)</div>
      <div className="row3">
        <select value={f.de} onChange={e => setF({ ...f, de: e.target.value })}><option value="">— actor A —</option>{entidades.map(x => <option key={x.id} value={x.id}>{x.nombre}</option>)}</select>
        <select value={f.a} onChange={e => setF({ ...f, a: e.target.value })}><option value="">— actor B —</option>{entidades.map(x => <option key={x.id} value={x.id}>{x.nombre}</option>)}</select>
        <input placeholder="qué los vincula" value={f.etiqueta} onChange={e => setF({ ...f, etiqueta: e.target.value })} />
      </div>
      <div className="row2">
        <label>Folio / página / minuto<input value={f.folio} onChange={e => setF({ ...f, folio: e.target.value })} placeholder="p. 3, f. 12, 04:35…" /></label>
        <label>Fecha del documento<input value={base.fechaDoc || ''} readOnly /></label>
      </div>
      <label>Nota<textarea rows={3} value={f.nota} onChange={e => setF({ ...f, nota: e.target.value })} placeholder="Qué dice, qué prueba, qué no prueba." /></label>
      <div className="modal-foot"><button className="btn ghost" onClick={onClose}>Cancelar</button><button className="btn" onClick={guardar}>Guardar evidencia</button></div>
    </>}
  </div></div>;
}
