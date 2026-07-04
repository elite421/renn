import Link from "next/link";
import { contact, navItems, products } from "../data";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div className="footer-brand">
          <Link className="brand footer-logo" href="/">
            <span className="brand-mark">RENN</span>
            <span>Products LLP</span>
          </Link>
          <p>Smart Solution For Better Tomorrow</p>
          <p>Premium hygiene paper, napkin and food-safe foil solutions engineered in India.</p>
        </div>

        <div>
          <h2>Pages</h2>
          <ul>
            {navItems.map((item) => (
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
            <a href={`tel:${contact.phonePrimary.replaceAll(" ", "")}`}>{contact.phonePrimary}</a>
            <a href={`tel:${contact.phoneSecondary.replaceAll(" ", "")}`}>{contact.phoneSecondary}</a>
            <a href={`mailto:${contact.email}`}>{contact.email}</a>
            <span>{contact.location}</span>
          </address>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2026 RENN Products LLP. All rights reserved.</span>
        <Link href="/contact">Send Enquiry</Link>
      </div>
    </footer>
  );
}
