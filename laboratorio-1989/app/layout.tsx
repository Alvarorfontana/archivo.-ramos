import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: 'ARCHIVO 1989 · Intelligence & Research Workbench', description: 'Archivo documental, investigación histórica y análisis trazable.' };
export default function RootLayout({ children }: Readonly<{children: React.ReactNode}>) { return <html lang="es"><body>{children}</body></html>; }
