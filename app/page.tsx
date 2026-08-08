import Image from "next/image";
import Link from "next/link";
import { ContactForm } from "./components/ContactForm";
import { ProductCard } from "./components/ProductCard";
import { SiteFooter } from "./components/SiteFooter";
import { SiteHeader } from "./components/SiteHeader";
import { getSiteContent } from "./lib/contentStore";

export const dynamic = "force-dynamic";

export default function Home() {
  const content = getSiteContent();
  const { header, home, contactInfo, products, processSteps } = content;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: `${header.brandMark} ${header.brandSub}`,
    url: "https://www.rennproducts.com",
    email: contactInfo.email,
    telephone: contactInfo.phonePrimary,
    slogan: home.metaSlogan,
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
      <SiteHeader customContent={content} />
      <main>
        <section className="hero" id="home">
          <div className="hero-copy">
            <p className="section-kicker">{home.heroKicker}</p>
            <h1>{home.heroTitle}</h1>
            <p>{home.heroDescription}</p>
            <div className="hero-actions">
              <Link className="button primary" href={home.heroBtnPrimaryLink || "/products"}>
                {home.heroBtnPrimaryText}
              </Link>
              <Link className="button secondary" href={home.heroBtnSecondaryLink || "/contact"}>
                {home.heroBtnSecondaryText}
              </Link>
            </div>
          </div>
          <div className="hero-showcase" aria-label={`${header.brandMark} product showcase`}>
            <div className="hero-image main">
              <Image
                src={home.heroMainImage}
                alt={home.heroMainImageAlt || "Product range"}
                fill
                priority
                sizes="(max-width: 900px) 100vw, 52vw"
              />
            </div>
            <div className="hero-image small top">
              <Image src={home.heroTopImage} alt={home.heroTopImageAlt || "Packaging"} fill sizes="220px" />
            </div>
            <div className="hero-image small bottom">
              <Image src={home.heroBottomImage} alt={home.heroBottomImageAlt || "Hygiene products"} fill sizes="220px" />
            </div>
          </div>
        </section>

        <section className="metric-strip" aria-label="Capabilities">
          {home.metrics.map((m, idx) => (
            <div key={idx}>
              <strong>{m.value}</strong>
              <span>{m.label}</span>
            </div>
          ))}
        </section>

        <section className="about-panel">
          <div className="about-image">
            <Image
              src={home.aboutImage}
              alt={home.aboutImageAlt || "Operations"}
              fill
              sizes="(max-width: 900px) 100vw, 46vw"
            />
          </div>
          <div className="about-copy">
            <p className="section-kicker">{home.aboutKicker}</p>
            <h2>{home.aboutTitle}</h2>
            <p>{home.aboutParagraph1}</p>
            <p>{home.aboutParagraph2}</p>
            <div className="capability-list">
              {home.capabilities.map((cap, idx) => (
                <article key={idx}>
                  <strong>{cap.title}</strong>
                  <span>{cap.text}</span>
                </article>
              ))}
            </div>
            <Link className="text-link dark" href="/about">
              {home.aboutReadMoreText}
            </Link>
          </div>
        </section>

        <section className="products-section">
          <div className="section-heading split">
            <div>
              <p className="section-kicker">{home.productsKicker}</p>
              <h2>{home.productsTitle}</h2>
            </div>
            <p>{home.productsSubheading}</p>
          </div>
          <div className="product-card-grid">
            {products.slice(0, 4).map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
          <div className="section-action">
            <Link className="button primary" href="/products">
              {home.productsExploreBtnText}
            </Link>
          </div>
        </section>

        <section className="packaging-band">
          <div className="packaging-copy">
            <p className="section-kicker">{home.packagingKicker}</p>
            <h2>{home.packagingTitle}</h2>
            <p>{home.packagingDescription}</p>
            <Link className="text-link" href="/contact">
              {home.packagingLinkText}
            </Link>
          </div>
          <div className="packaging-gallery">
            <div>
              <Image src={home.packagingImage1} alt={home.packagingImage1Alt || "Custom packaging"} fill sizes="(max-width: 900px) 100vw, 34vw" />
            </div>
            <div>
              <Image src={home.packagingImage2} alt={home.packagingImage2Alt || "Product range display"} fill sizes="(max-width: 900px) 100vw, 30vw" />
            </div>
          </div>
        </section>

        <section className="process-section">
          <div className="section-heading">
            <p className="section-kicker">{home.processKicker}</p>
            <h2>{home.processTitle}</h2>
          </div>
          <div className="process-grid compact">
            {processSteps.slice(0, 4).map((step, idx) => (
              <article key={idx}>
                <span>{step.number}</span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="sectors" aria-labelledby="sectors-title">
          <p className="section-kicker">{home.sectorsKicker}</p>
          <h2 id="sectors-title">{home.sectorsTitle}</h2>
          <div>
            {home.sectors.map((sector) => (
              <span key={sector}>{sector}</span>
            ))}
          </div>
        </section>

        <section className="contact-preview">
          <div className="contact-copy">
            <p className="section-kicker">{home.contactKicker}</p>
            <h2>{home.contactTitle}</h2>
            <p>{home.contactDescription}</p>
            <address>
              <a href={`tel:${contactInfo.phonePrimary.replaceAll(" ", "")}`}>{contactInfo.phonePrimary}</a>
              <a href={`tel:${contactInfo.phoneSecondary.replaceAll(" ", "")}`}>{contactInfo.phoneSecondary}</a>
              <a href={`mailto:${contactInfo.email}`}>{contactInfo.email}</a>
            </address>
          </div>
          <ContactForm customContent={content} />
        </section>
      </main>
      <SiteFooter customContent={content} />
    </>
  );
}
