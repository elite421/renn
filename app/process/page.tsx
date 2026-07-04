import Link from "next/link";
import { PageHero } from "../components/PageHero";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";
import { process } from "../data";

export const metadata = {
  title: "Process",
  description: "See how RENN Products LLP handles hygiene product enquiries, specifications, production, packing and dispatch."
};

export default function ProcessPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <PageHero
          kicker="Process"
          title="A simple path from product requirement to repeat supply."
          text="The process is designed to clarify specifications early, reduce confusion during packing and make repeat orders easier for business customers."
          image="/images/company-profile.png"
          alt="RENN company profile product artwork"
        />

        <section className="process-section page">
          <div className="timeline">
            {process.map(([number, title, text]) => (
              <article key={number}>
                <span>{number}</span>
                <div>
                  <h2>{title}</h2>
                  <p>{text}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="quality-band">
          <div>
            <p className="section-kicker">Quality Approach</p>
            <h2>Clear specifications, cleaner packing and practical dispatch planning.</h2>
          </div>
          <p>
            RENN works with clients to understand the end-use environment before finalizing supply, whether the product
            is going to retail shelves, hotel rooms, washrooms, kitchens, dining spaces or distributor cartons.
          </p>
        </section>

        <section className="cta-band">
          <h2>Ready to define your next order?</h2>
          <Link className="button primary" href="/contact">
            Start an Enquiry
          </Link>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
