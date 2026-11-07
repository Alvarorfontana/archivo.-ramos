'use client';
import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { E, F, evidenciaInfo, expedientes, hechos, vinculos, X } from '@/data/caso';
import { fechaLarga } from '@/components/ui';
import { descargar, useEvidencias, type EvidenciaUsuario } from '@/lib/store';

function generar(id: string, mias: EvidenciaUsuario[]) {
  const x = X[id]; const ids = new Set(x.actores);
  const hs = hechos.filter(h => h.expedientes.includes(id)).sort((a, b) => a.fecha.localeCompare(b.fecha));
  const vs = vinculos.filter(v => ids.has(v.de) && ids.has(v.a));
  const citas: string[] = []; const cita = (u: string, t: string) => { let i = citas.findIndex(c => c.includes(u)); if (i < 0) { citas.push(t + ' — ' + u); i = citas.length - 1; } return '[' + (i + 1) + ']'; };
  const L: string[] = [];
  L.push(`# ${x.codigo} · ${x.titulo}`, '', `**Pregunta de investigación.** ${x.pregunta}`, '', x.resumen, '');
  L.push('## Hechos establecidos', '');
  hs.filter(h => h.evidencia !== 'hipotesis').forEach(h => L.push(`- **${fechaLarga(h.fecha)}** · ${h.titulo}. ${h.resumen}${(h.fuentes || []).map(f => ' ' + cita(F[f].url, F[f].titulo + ', ' + F[f].institucion)).join('')}${h.evidencia === 'contexto' ? ' _(contexto)_' : ''}${h.verificar ? ` _A verificar: ${h.verificar}_` : ''}`));
  const doc = vs.filter(v => v.evidencia === 'documentado');
  if (doc.length) { L.push('', '## Vínculos documentados', ''); doc.forEach(v => L.push(`- ${E[v.de].nombre} → ${E[v.a].nombre}: ${v.etiqueta}${v.fecha ? ' (' + v.fecha + ')' : ''}${(v.fuentes || []).map(f => ' ' + cita(F[f].url, F[f].titulo + ', ' + F[f].institucion)).join('')}${v.nota ? '. ' + v.nota : ''}`)); }
  const hechosMios = mias.filter(m => m.clasificacion === 'hecho'); const otras = mias.filter(m => m.clasificacion !== 'hecho');
  if (hechosMios.length) { L.push('', '## Evidencia incorporada', ''); hechosMios.forEach(m => L.push(`- ${m.titulo}${m.folio ? ', ' + m.folio : ''}. ${m.nota || ''} ${cita(m.url, m.titulo + ', ' + m.origen)}`)); }
  const hip = vs.filter(v => v.evidencia === 'hipotesis');
  if (hip.length || otras.length) { L.push('', '## Hipótesis e interpretaciones (no probadas)', ''); hip.forEach(v => L.push(`- ${E[v.de].nombre} → ${E[v.a].nombre}: ${v.etiqueta}.${v.nota ? ' ' + v.nota : ''}`)); otras.forEach(m => L.push(`- ${m.titulo}: ${m.nota || ''} ${cita(m.url, m.titulo + ', ' + m.origen)}`)); }
  L.push('', '## Qué falta probar', ''); x.pendientes.forEach(p => L.push('- [ ] ' + p));
  L.push('', '## Fuentes', ''); citas.forEach((c, i) => L.push(`${i + 1}. ${c}`));
  L.push('', `_Informe generado en 1989 / ARCHIVE el ${new Date().toLocaleDateString('es-AR')}. Distingue ${Object.values(evidenciaInfo).map(e => e.label.toLowerCase()).join(', ')}._`);
  return L.join('\n');
}

function md2html(md: string) {
  const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
  const inl = (s: string) => esc(s).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/_(.+?)_/g, '<i>$1</i>').replace(/(https?:\/\/\S+)/g, '<a href="$1">$1</a>');
  let out = '', list = '';
  for (const l of md.split('\n')) {
    const m = l.match(/^(#{1,3}) (.*)/); const li = l.match(/^(- \[ \] |- |\d+\. )(.*)/);
    if (li) { const t = /^\d/.test(li[1]) ? 'ol' : 'ul'; if (list !== t) { out += list ? `</${list}>` : ''; out += `<${t}>`; list = t; } out += `<li>${li[1].includes('[ ]') ? '☐ ' : ''}${inl(li[2])}</li>`; continue; }
    if (list) { out += `</${list}>`; list = ''; }
    if (m) out += `<h${m[1].length}>${inl(m[2])}</h${m[1].length}>`; else if (l.trim()) out += `<p>${inl(l)}</p>`;
  }
  return out + (list ? `</${list}>` : '');
}

function Informes() {
  const sp = useSearchParams(); const [id, setId] = useState(sp.get('exp') || expedientes[0].id);
  const { items, listo } = useEvidencias(); const [txt, setTxt] = useState(''); const [ver, setVer] = useState(false);
  const KEY = 'archivo1989.informe.' + id;
  useEffect(() => { if (!listo) return; let s = ''; try { s = localStorage.getItem(KEY) || ''; } catch {} setTxt(s || generar(id, items.filter(i => i.expediente === id))); /* eslint-disable-next-line */ }, [id, listo]);
  useEffect(() => { if (txt) try { localStorage.setItem(KEY, txt); } catch {} }, [txt, KEY]);
  function imprimir() {
    const w = window.open('', '_blank'); if (!w) return;
    w.document.write(`<!doctype html><html lang="es"><head><meta charset="utf-8"><title>${X[id].codigo} ${X[id].titulo}</title><style>body{font:12pt/1.55 Georgia,serif;max-width:720px;margin:40px auto;color:#111}h1{font-size:22pt;border-bottom:2px solid #111;padding-bottom:8px}h2{font-size:14pt;margin-top:26px;text-transform:uppercase;letter-spacing:.5px}a{color:#333;word-break:break-all}li{margin:5px 0}header{font:9pt monospace;color:#555;letter-spacing:1px}</style></head><body><header>1989 / ARCHIVE · INFORME DE INVESTIGACIÓN</header>${md2html(txt)}<script>setTimeout(()=>print(),300)</script></body></html>`);
    w.document.close();
  }
  return <>
    <header className="page-head"><div><span className="eyebrow">INFORMES</span><h1>Redactor de informes con citas</h1>
      <p className="lead">El borrador se arma solo con los hechos, vínculos, hipótesis y tus evidencias del expediente, con las fuentes numeradas. Lo editás y lo bajás como PDF o texto.</p></div></header>
    <div className="toolbar">
      <select value={id} onChange={e => setId(e.target.value)}>{expedientes.map(x => <option key={x.id} value={x.id}>{x.codigo} · {x.titulo}</option>)}</select>
      <button className="btn small ghost" onClick={() => { if (confirm('¿Regenerar el borrador? Se pierden tus cambios en el texto.')) setTxt(generar(id, items.filter(i => i.expediente === id))); }}>↻ Regenerar con lo último</button>
      <button className="btn small ghost" onClick={() => setVer(v => !v)}>{ver ? 'Editar' : 'Vista previa'}</button>
      <button className="btn small ghost" onClick={() => descargar(X[id].codigo + '-informe.md', txt, 'text/markdown')}>Bajar texto</button>
      <button className="btn small" onClick={imprimir}>Imprimir / PDF</button>
    </div>
    {ver ? <article className="card report" dangerouslySetInnerHTML={{ __html: md2html(txt) }} /> : <textarea className="editor" value={txt} onChange={e => setTxt(e.target.value)} spellCheck />}
  </>;
}
export default function Page() { return <Suspense><Informes /></Suspense>; }
