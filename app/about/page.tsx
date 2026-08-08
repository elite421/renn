import Image from "next/image";
import Link from "next/link";
import { PageHero } from "../components/PageHero";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";
import { getSiteContent } from "../lib/contentStore";

export const dynamic = "force-dynamic";

export default function AboutPage() {
  const content = getSiteContent();
  const { about, home } = content;

  return (
    <>
      <SiteHeader customContent={content} />
      <main>
        <PageHero
          kicker={about.heroKicker}
          title={about.heroTitle}
          text={about.heroText}
          image={about.heroImage}
          alt={about.heroImageAlt || "About RENN"}
        />

        {/* Core Story Section */}
        <section className="story-section">
          <div className="story-copy">
            <p className="section-kicker">{about.directionKicker}</p>
            <h2>{about.directionHeading}</h2>
            <p>{about.directionParagraph1}</p>
            <p>{about.directionParagraph2}</p>
          </div>
          <div className="story-card">
            <Image src={about.operationsImage} alt={about.operationsImageAlt || "Operations"} fill sizes="(max-width: 900px) 100vw, 40vw" />
          </div>
        </section>

        {/* Mission Section */}
        <section className="packaging-band">
          <div className="packaging-copy">
            <p className="section-kicker">{about.missionKicker || "Our Mission"}</p>
            <h2>{about.missionHeading}</h2>
            <p>{about.missionText1}</p>
            <p>{about.missionText2}</p>
          </div>
          <div className="story-card" style={{ flex: "0 0 320px", height: "300px" }}>
            <Image src="/images/facial-tissues-fresh.png" alt="RENN mission" fill sizes="320px" />
          </div>
        </section>

        {/* Core Values Section */}
        <section className="values-section">
          <div className="section-heading">
            <p className="section-kicker">{about.focusKicker}</p>
            <h2>{about.focusHeading}</h2>
          </div>
          <div className="capability-list wide">
            {home.capabilities.map((cap, idx) => (
              <article key={idx}>
                <strong>{idx + 1}. {cap.title}</strong>
                <span>{cap.text}</span>
              </article>
            ))}
          </div>
        </section>

        {/* Promise Section */}
        <section className="quality-band">
          <div>
            <p className="section-kicker">Our Commitment</p>
            <h2>{about.promiseHeading || "Our Promise to You"}</h2>
          </div>
          <p>{about.promiseText}</p>
        </section>

        {/* Markets Served Section */}
        <section className="sectors light">
          <p className="section-kicker">{about.marketsKicker}</p>
          <h2>{about.marketsHeading}</h2>
          <div>
            {home.sectors.map((sector) => (
              <span key={sector}>{sector}</span>
            ))}
          </div>
        </section>

        <section className="cta-band">
          <h2>{about.ctaHeading}</h2>
          <Link className="button primary" href="/contact">
            {about.ctaBtnText}
          </Link>
        </section>
      </main>
      <SiteFooter customContent={content} />
    </>
  );
}
