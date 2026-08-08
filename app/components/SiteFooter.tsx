import Link from "next/link";
import { getSiteContent } from "../lib/contentStore";

export function SiteFooter({ customContent }: { customContent?: ReturnType<typeof getSiteContent> }) {
  const content = customContent || getSiteContent();
  const { header, footer, contactInfo, products } = content;

  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div className="footer-brand">
          <Link className="brand footer-logo" href="/">
            <span className="brand-mark">{header.brandMark}</span>
            <span>{header.brandSub}</span>
          </Link>
          <p>{footer.slogan}</p>
          <p>{footer.description}</p>
        </div>

        <div>
          <h2>Pages</h2>
          <ul>
            {header.navItems.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2>Products</h2>
          <ul>
            {products.slice(0, 5).map((product) => (
              <li key={product.slug}>
                <Link href={`/products#${product.slug}`}>{product.title}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2>Contact</h2>
          <address>
            <a href={`tel:${contactInfo.phonePrimary.replaceAll(" ", "")}`}>{contactInfo.phonePrimary}</a>
            <a href={`tel:${contactInfo.phoneSecondary.replaceAll(" ", "")}`}>{contactInfo.phoneSecondary}</a>
            <a href={`mailto:${contactInfo.email}`}>{contactInfo.email}</a>
            <span>{contactInfo.location}</span>
          </address>
        </div>
      </div>
      <div className="footer-bottom">
        <span>{footer.copyrightText}</span>
        <Link href="/contact">{footer.ctaText}</Link>
      </div>
    </footer>
  );
}
