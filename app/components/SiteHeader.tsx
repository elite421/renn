import Link from "next/link";
import { getSiteContent } from "../lib/contentStore";
import { ThemeToggleClient } from "./ThemeToggleClient";

export function SiteHeader({ customContent }: { customContent?: ReturnType<typeof getSiteContent> }) {
  const content = customContent || getSiteContent();
  const { header, theme } = content;

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

      <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
        <ThemeToggleClient enabled={theme?.enabled || false} />
        <Link className="nav-cta" href="/contact">
          {header.ctaText}
        </Link>
      </div>

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
          <ThemeToggleClient enabled={theme?.enabled || false} />
          <Link className="mobile-cta" href="/contact">
            {header.mobileCtaText}
          </Link>
        </nav>
      </details>
    </header>
  );
}
