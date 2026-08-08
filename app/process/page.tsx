import Link from "next/link";
import { PageHero } from "../components/PageHero";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";
import { getSiteContent } from "../lib/contentStore";

export const dynamic = "force-dynamic";

export default function ProcessPage() {
  const content = getSiteContent();
  const { processPage, processSteps } = content;

  return (
    <>
      <SiteHeader customContent={content} />
      <main>
        <PageHero
          kicker={processPage.heroKicker}
          title={processPage.heroTitle}
          text={processPage.heroText}
          image={processPage.heroImage}
          alt={processPage.heroImageAlt || "Process"}
        />

        <section className="process-section page">
          <div className="timeline">
            {processSteps.map((step, idx) => (
              <article key={idx}>
                <span>{step.number}</span>
                <div>
                  <h2>{step.title}</h2>
                  <p>{step.text}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="quality-band">
          <div>
            <p className="section-kicker">{processPage.qualityKicker}</p>
            <h2>{processPage.qualityTitle}</h2>
          </div>
          <p>{processPage.qualityDescription}</p>
        </section>

        <section className="cta-band">
          <h2>{processPage.ctaHeading}</h2>
          <Link className="button primary" href="/contact">
            {processPage.ctaBtnText}
          </Link>
        </section>
      </main>
      <SiteFooter customContent={content} />
    </>
  );
}
