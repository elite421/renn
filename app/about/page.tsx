import Image from "next/image";
import Link from "next/link";
import { PageHero } from "../components/PageHero";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";
import { capabilities, sectors } from "../data";

export const metadata = {
  title: "About RENN Products LLP",
  description: "Learn about RENN Products LLP, an Indian hygiene paper, napkin and food packaging supplier."
};

export default function AboutPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <PageHero
          kicker="About Us"
          title="Reliable hygiene products with a practical manufacturing mindset."
          text="RENN Products LLP supports businesses that want attractive product presentation, clean handling and consistent supply across tissue, napkin, roll and foil categories."
          image="/images/story-renn.png"
          alt="RENN products arranged for brand story"
        />

        <section className="story-section">
          <div className="story-copy">
            <p className="section-kicker">Our Direction</p>
            <h2>Everyday essentials should look good, perform well and arrive reliably.</h2>
            <p>
              The company is built around products that move quickly through real business environments: restaurants,
              hotels, offices, hospitals, retail stores, caterers and distributors.
            </p>
            <p>
              RENN combines product selection, pack planning and responsive communication so customers can source
              hygiene essentials without unnecessary friction.
            </p>
          </div>
          <div className="story-card">
            <Image src="/images/about-operations.png" alt="RENN operations visual" fill sizes="(max-width: 900px) 100vw, 40vw" />
          </div>
        </section>

        <section className="values-section">
          <div className="section-heading">
            <p className="section-kicker">What We Focus On</p>
            <h2>Details that make repeat supply easier.</h2>
          </div>
          <div className="capability-list wide">
            {capabilities.map(([title, text]) => (
              <article key={title}>
                <strong>{title}</strong>
                <span>{text}</span>
              </article>
            ))}
          </div>
        </section>

        <section className="sectors light">
          <p className="section-kicker">Markets Served</p>
          <h2>Built for high-use places where hygiene is visible every day.</h2>
          <div>
            {sectors.map((sector) => (
              <span key={sector}>{sector}</span>
            ))}
          </div>
        </section>

        <section className="cta-band">
          <h2>Planning a new tissue, napkin or foil requirement?</h2>
          <Link className="button primary" href="/contact">
            Send Enquiry
          </Link>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
