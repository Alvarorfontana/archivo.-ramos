import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: '1989 / ARCHIVE · Ramos, Negroponte y el tablero de 1989', description: 'Laboratorio de investigación histórica: Jorge Abelardo Ramos, John Negroponte, Menem, Bush y Salinas. Archivo, red de relaciones, atlas e informes con fuentes.' };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es"><head>
    <link rel="preconnect" href="https://fonts.googleapis.com" /><link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
    {/* eslint-disable-next-line @next/next/no-page-custom-font */}
    <link href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,500&display=swap" rel="stylesheet" />
  </head><body>{children}</body></html>;
}
