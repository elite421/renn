import Link from "next/link";
import { navItems } from "../data";

export function SiteHeader() {
  return (
    <header className="site-header" aria-label="Primary navigation">
      <Link className="brand" href="/" aria-label="RENN Products home">
        <span className="brand-mark">RENN</span>
        <span>Products LLP</span>
      </Link>

      <nav className="desktop-nav" aria-label="Main menu">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href}>
            {item.label}
          </Link>
        ))}
      </nav>

      <Link className="nav-cta" href="/contact">
        Enquire
      </Link>

      <details className="mobile-menu">
        <summary aria-label="Open navigation">
          <span />
          <span />
          <span />
        </summary>
        <nav aria-label="Mobile menu">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
          <Link className="mobile-cta" href="/contact">
            Request Quote
          </Link>
        </nav>
      </details>
    </header>
  );
}
