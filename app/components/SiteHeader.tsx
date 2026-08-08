import Link from "next/link";
import { getSiteContent } from "../lib/contentStore";

export function SiteHeader({ customContent }: { customContent?: ReturnType<typeof getSiteContent> }) {
  const content = customContent || getSiteContent();
  const { header } = content;

  return (
    <header className="site-header" aria-label="Primary navigation">
      <Link className="brand" href="/" aria-label={`${header.brandMark} home`}>
        <span className="brand-mark">{header.brandMark}</span>
        <span>{header.brandSub}</span>
      </Link>

      <nav className="desktop-nav" aria-label="Main menu">
        {header.navItems.map((item) => (
          <Link key={item.href} href={item.href}>
            {item.label}
          </Link>
        ))}
      </nav>

      <Link className="nav-cta" href="/contact">
        {header.ctaText}
      </Link>

      <details className="mobile-menu">
        <summary aria-label="Open navigation">
          <span />
          <span />
          <span />
        </summary>
        <nav aria-label="Mobile menu">
          {header.navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
          <Link className="mobile-cta" href="/contact">
            {header.mobileCtaText}
          </Link>
        </nav>
      </details>
    </header>
  );
}
