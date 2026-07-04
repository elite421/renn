import Image from "next/image";
import Link from "next/link";
import { PageHero } from "../components/PageHero";
import { ProductCard } from "../components/ProductCard";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";
import { products } from "../data";

export const metadata = {
  title: "Products",
  description: "Explore RENN Products LLP tissue paper, napkins, toilet rolls, kitchen towels, aluminium foil and custom packaging."
};

export default function ProductsPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <PageHero
          kicker="Products"
          title="A complete hygiene and food-service essentials range."
          text="Explore tissue paper, napkins, roll products, aluminium foil, custom packaging and bulk supply options for retail, horeca and institutional clients."
          image="/images/product-showcase.png"
          alt="RENN product showcase"
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
              <p className="section-kicker">Product Details</p>
              <h2>Specifications can be aligned to your business model.</h2>
            </div>
            <p>Use this range as a starting point, then share quantity, pack type, branding and destination needs.</p>
          </div>
          <div className="detail-grid">
            {products.map((product) => (
              <article key={product.slug}>
                <div>
                  <Image src={product.image} alt={product.title} fill sizes="96px" />
                </div>
                <h3>{product.title}</h3>
                <ul>
                  {product.specs.map((spec) => (
                    <li key={spec}>{spec}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="cta-band">
          <h2>Need mixed products or private-label packaging?</h2>
          <Link className="button primary" href="/contact">
            Request Product Quote
          </Link>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
