import Image from "next/image";
import Link from "next/link";
import { PageHero } from "../components/PageHero";
import { ProductCard } from "../components/ProductCard";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";
import { getSiteContent } from "../lib/contentStore";

export const dynamic = "force-dynamic";

export default function ProductsPage() {
  const content = getSiteContent();
  const { productsPage, products } = content;

  return (
    <>
      <SiteHeader customContent={content} />
      <main>
        <PageHero
          kicker={productsPage.heroKicker}
          title={productsPage.heroTitle}
          text={productsPage.heroText}
          image={productsPage.heroImage}
          alt={productsPage.heroImageAlt || "Products"}
        />

        <section className="products-section page">
          <div className="product-card-grid">
            {products.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        </section>

        <section className="detail-section">
          <div className="section-heading split">
            <div>
              <p className="section-kicker">{productsPage.detailsKicker}</p>
              <h2>{productsPage.detailsTitle}</h2>
            </div>
            <p>{productsPage.detailsSubheading}</p>
          </div>
          <div className="detail-grid">
            {products.map((product) => (
              <article key={product.slug}>
                <div>
                  <Image src={product.image} alt={product.title} fill sizes="96px" />
                </div>
                <h3>{product.title}</h3>
                <ul>
                  {product.specs.map((spec, idx) => (
                    <li key={idx}>{spec}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="cta-band">
          <h2>{productsPage.ctaHeading}</h2>
          <Link className="button primary" href="/contact">
            {productsPage.ctaBtnText}
          </Link>
        </section>
      </main>
      <SiteFooter customContent={content} />
    </>
  );
}
