import Link from 'next/link';
import Nav from './Nav';

export default function CentroLayout({ children }: { children: React.ReactNode }) {
  return <div className="centro">
    <aside className="side">
      <Link href="/" className="brand"><span className="seal">89</span><span><b>1989 / ARCHIVE</b><small>CENTRO DE INVESTIGACIÓN</small></span></Link>
      <Nav />
      <div className="side-foot">Caso Ramos–Negroponte<br />Argentina · México · EE.UU.<br />1983–1995</div>
    </aside>
    <main className="work">{children}</main>
  </div>;
}
