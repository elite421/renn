import Image from "next/image";
import Link from "next/link";
import { ContactForm } from "./components/ContactForm";
import { ProductCard } from "./components/ProductCard";
import { SiteFooter } from "./components/SiteFooter";
import { SiteHeader } from "./components/SiteHeader";
import { capabilities, contact, metrics, process, products, sectors } from "./data";

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "RENN Products LLP",
    url: "https://www.rennproducts.com",
    email: contact.email,
    telephone: contact.phonePrimary,
    slogan: "Smart Solution For Better Tomorrow",
    address: {
      "@type": "PostalAddress",
      addressCountry: "IN"
    },
    makesOffer: products.map((product) => ({
      "@type": "Offer",
      itemOffered: {
        "@type": "Product",
        name: product.title,
        description: product.text
      }
    }))
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SiteHeader />
      <main>
        <section className="hero" id="home">
          <div className="hero-copy">
            <p className="section-kicker">Made in India hygiene solutions</p>
            <h1>Smart Solution For Better Tomorrow</h1>
            <p>
              Premium tissue, napkin, roll, aluminium foil and custom-packaging solutions for businesses that need clean
              presentation, dependable quality and repeat supply.
            </p>
            <div className="hero-actions">
              <Link className="button primary" href="/products">
                View Products
              </Link>
              <Link className="button secondary" href="/contact">
                Request Quote
              </Link>
            </div>
          </div>
          <div className="hero-showcase" aria-label="RENN product showcase">
            <div className="hero-image main">
              <Image
                src="/images/hero-products.png"
                alt="RENN tissue and aluminium foil product range"
                fill
                priority
                sizes="(max-width: 900px) 100vw, 52vw"
              />
            </div>
            <div className="hero-image small top">
              <Image src="/images/custom-packaging.png" alt="Custom RENN packaging examples" fill sizes="220px" />
            </div>
            <div className="hero-image small bottom">
              <Image src="/images/story-renn.png" alt="RENN hygiene products arranged together" fill sizes="220px" />
            </div>
          </div>
        </section>

        <section className="metric-strip" aria-label="RENN capabilities">
          {metrics.map(([value, label]) => (
            <div key={value}>
              <strong>{value}</strong>
              <span>{label}</span>
            </div>
          ))}
        </section>

        <section className="about-panel">
          <div className="about-image">
            <Image
              src="/images/about-operations.png"
              alt="RENN production and packaging operations"
              fill
              sizes="(max-width: 900px) 100vw, 46vw"
            />
          </div>
          <div className="about-copy">
            <p className="section-kicker">About RENN Products LLP</p>
            <h2>Built for brands that care about hygiene, finish and dependable supply.</h2>
            <p>
              RENN Products LLP manufactures everyday hygiene and food-service essentials for retail, horeca,
              institutional and distributor requirements.
            </p>
            <p>
              The product range is designed for real commercial use: dining tables, washrooms, kitchens, reception
              desks, retail shelves and high-volume facilities.
            </p>
            <div className="capability-list">
              {capabilities.map(([title, text]) => (
                <article key={title}>
                  <strong>{title}</strong>
                  <span>{text}</span>
                </article>
              ))}
            </div>
            <Link className="text-link dark" href="/about">
              Read more about us
            </Link>
          </div>
        </section>

        <section className="products-section">
          <div className="section-heading split">
            <div>
              <p className="section-kicker">Product Range</p>
              <h2>Essential products, presented with a premium client-ready finish.</h2>
            </div>
            <p>Choose standard supply or customize ply, pack size, branding and presentation for your business model.</p>
          </div>
          <div className="product-card-grid">
            {products.slice(0, 4).map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
          <div className="section-action">
            <Link className="button primary" href="/products">
              Explore Full Range
            </Link>
          </div>
        </section>

        <section className="packaging-band">
          <div className="packaging-copy">
            <p className="section-kicker">Custom Supply Support</p>
            <h2>Packaging that works on shelves, counters and in bulk movement.</h2>
            <p>
              Support for branded napkins, private-label tissue packs, carton-ready quantities and practical product
              combinations for everyday commercial use.
            </p>
            <Link className="text-link" href="/contact">
              Discuss custom packaging
            </Link>
          </div>
          <div className="packaging-gallery">
            <div>
              <Image src="/images/custom-packaging.png" alt="RENN custom packaging visual" fill sizes="(max-width: 900px) 100vw, 34vw" />
            </div>
            <div>
              <Image src="/images/product-showcase.png" alt="RENN complete product range display" fill sizes="(max-width: 900px) 100vw, 30vw" />
            </div>
          </div>
        </section>

        <section className="process-section">
          <div className="section-heading">
            <p className="section-kicker">How We Work</p>
            <h2>A clear supply process from requirement to repeat orders.</h2>
          </div>
          <div className="process-grid compact">
            {process.slice(0, 4).map(([number, title, text]) => (
              <article key={number}>
                <span>{number}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="sectors" aria-labelledby="sectors-title">
          <p className="section-kicker">Widely Used In</p>
          <h2 id="sectors-title">Daily business environments where presentation and hygiene matter.</h2>
          <div>
            {sectors.map((sector) => (
              <span key={sector}>{sector}</span>
            ))}
          </div>
        </section>

        <section className="contact-preview">
          <div className="contact-copy">
            <p className="section-kicker">Contact Us</p>
            <h2>Send an enquiry for retail, bulk supply or custom branding.</h2>
            <p>Share your product requirement and RENN Products LLP will receive the enquiry directly.</p>
            <address>
              <a href="tel:+917738469862">{contact.phonePrimary}</a>
              <a href="tel:+917738469866">{contact.phoneSecondary}</a>
              <a href={`mailto:${contact.email}`}>{contact.email}</a>
            </address>
          </div>
          <ContactForm />
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
