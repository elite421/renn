import { ContactForm } from "../components/ContactForm";
import { PageHero } from "../components/PageHero";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";
import { contact } from "../data";

export const metadata = {
  title: "Contact",
  description: "Contact RENN Products LLP for tissue, napkin, aluminium foil, custom packaging and bulk hygiene supply enquiries."
};

export default function ContactPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <PageHero
          kicker="Contact"
          title="Tell us what you need. We will help shape the product requirement."
          text="Share the product category, quantity, city, packaging expectations and branding needs so the team can respond with the right direction."
          image="/images/custom-packaging.png"
          alt="RENN custom packaging products"
        />

        <section className="contact-preview page">
          <div className="contact-copy">
            <p className="section-kicker">Reach RENN Products LLP</p>
            <h2>For retail, horeca, distributor, institutional and custom branding enquiries.</h2>
            <p>Use the form or contact directly through phone and email.</p>
            <address>
              <a href="tel:+917738469862">{contact.phonePrimary}</a>
              <a href="tel:+917738469866">{contact.phoneSecondary}</a>
              <a href={`mailto:${contact.email}`}>{contact.email}</a>
              <span>{contact.location}</span>
            </address>
          </div>
          <ContactForm />
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
