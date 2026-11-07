'use client';
import { useCallback, useEffect, useState } from 'react';

// Evidencias que el investigador guarda. Viven en el navegador (localStorage)
// y se exportan/importan como JSON para pasarlas de un equipo a otro.

export type Clasificacion = 'hecho' | 'interpretacion' | 'hipotesis';
export interface EvidenciaUsuario {
  id: string; titulo: string; url: string; origen: string; formato?: string; fechaDoc?: string;
  clasificacion: Clasificacion; expediente: string; actores: string[];
  vinculo?: { de: string; a: string; etiqueta: string };
  folio?: string; nota?: string; creado: string;
}

const KEY = 'archivo1989.evidencias.v1';
const EVT = 'archivo1989:evidencias';

function leer(): EvidenciaUsuario[] {
  try { const v = JSON.parse(localStorage.getItem(KEY) || '[]'); return Array.isArray(v) ? v : []; } catch { return []; }
}
function escribir(v: EvidenciaUsuario[]) {
  try { localStorage.setItem(KEY, JSON.stringify(v)); } catch {}
  window.dispatchEvent(new Event(EVT));
}

export function useEvidencias() {
  const [items, setItems] = useState<EvidenciaUsuario[]>([]);
  const [listo, setListo] = useState(false);
  useEffect(() => {
    const sync = () => setItems(leer());
    sync(); setListo(true);
    window.addEventListener(EVT, sync); window.addEventListener('storage', sync);
    return () => { window.removeEventListener(EVT, sync); window.removeEventListener('storage', sync); };
  }, []);
  const agregar = useCallback((e: Omit<EvidenciaUsuario, 'id' | 'creado'>) => {
    const nueva = { ...e, id: Math.random().toString(36).slice(2, 10), creado: new Date().toISOString() };
    escribir([nueva, ...leer()]); return nueva;
  }, []);
  const borrar = useCallback((id: string) => escribir(leer().filter(x => x.id !== id)), []);
  const actualizar = useCallback((id: string, cambios: Partial<EvidenciaUsuario>) => escribir(leer().map(x => x.id === id ? { ...x, ...cambios } : x)), []);
  const importar = useCallback((lista: EvidenciaUsuario[]) => {
    const actuales = leer(); const ids = new Set(actuales.map(x => x.id));
    const nuevas = lista.filter(x => x && x.id && x.titulo && !ids.has(x.id));
    escribir([...nuevas, ...actuales]); return nuevas.length;
  }, []);
  return { items, listo, agregar, borrar, actualizar, importar };
}

export function descargar(nombre: string, contenido: string, tipo = 'application/json') {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([contenido], { type: tipo }));
  a.download = nombre; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}
