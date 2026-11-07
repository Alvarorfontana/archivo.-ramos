'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEvidencias } from '@/lib/store';

const items = [
  ['/centro', 'Panel', '◎'],
  ['/centro/buscar', 'Buscador', '⌕'],
  ['/centro/expedientes', 'Expedientes', '▤'],
  ['/centro/red', 'Red de relaciones', '⋈'],
  ['/centro/atlas', 'Atlas', '◍'],
  ['/centro/cronologia', 'Cronología', '┃'],
  ['/centro/evidencias', 'Evidencias', '✦'],
  ['/centro/informes', 'Informes', '✎'],
  ['/centro/fuentes', 'Fuentes y archivos', '⌂'],
] as const;

export default function Nav() {
  const p = usePathname(); const { items: ev } = useEvidencias();
  return <nav className="nav">{items.map(([href, label, ic]) => {
    const on = href === '/centro' ? p === href : p.startsWith(href);
    return <Link key={href} href={href} className={on ? 'on' : ''}><i>{ic}</i>{label}{href === '/centro/evidencias' && ev.length > 0 && <em>{ev.length}</em>}</Link>;
  })}</nav>;
}
