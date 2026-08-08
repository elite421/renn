import { ContactForm } from "../components/ContactForm";
import { PageHero } from "../components/PageHero";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";
import { getSiteContent } from "../lib/contentStore";

export const dynamic = "force-dynamic";

export default function ContactPage() {
  const content = getSiteContent();
  const { contactPage, contactInfo } = content;

  return (
    <>
      <SiteHeader customContent={content} />
      <main>
        <PageHero
          kicker={contactPage.heroKicker}
          title={contactPage.heroTitle}
          text={contactPage.heroText}
          image={contactPage.heroImage}
          alt={contactPage.heroImageAlt || "Contact"}
        />

        <section className="contact-preview page">
          <div className="contact-copy">
            <p className="section-kicker">{contactPage.reachKicker}</p>
            <h2>{contactPage.reachTitle}</h2>
            <p>{contactPage.reachDescription}</p>
            <address>
              <a href={`tel:${contactInfo.phonePrimary.replaceAll(" ", "")}`}>{contactInfo.phonePrimary}</a>
              <a href={`tel:${contactInfo.phoneSecondary.replaceAll(" ", "")}`}>{contactInfo.phoneSecondary}</a>
              <a href={`mailto:${contactInfo.email}`}>{contactInfo.email}</a>
              <span>{contactInfo.location}</span>
            </address>
          </div>
          <ContactForm customContent={content} />
        </section>
      </main>
      <SiteFooter customContent={content} />
    </>
  );
}
