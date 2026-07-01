import Image from "next/image";

const products = [
  {
    title: "Paper Napkins",
    label: "Dining, horeca and retail",
    text: "Soft, absorbent napkins with clean finishing for restaurants, caterers, corporate events and branded retail packs.",
    image: "/images/napkins.png",
    points: ["1-ply and 2-ply options", "Custom folds and sizes", "Brand printing available"]
  },
  {
    title: "Facial & Table Top Tissues",
    label: "Homes, offices and facilities",
    text: "Hygienic, skin-friendly tissues packed for daily use across homes, offices, clinics, restaurants and managed spaces.",
    image: "/images/facial-tissue.png",
    points: ["Premium softness", "Controlled dispensing", "Table-ready packs"]
  },
  {
    title: "Toilet Rolls & Kitchen Towels",
    label: "Washroom and kitchen care",
    text: "Strong roll products with reliable absorbency for washrooms, kitchens, eateries, hotels and institutional operations.",
    image: "/images/rolls.png",
    points: ["Standard and jumbo rolls", "Perforated sheets", "Easy bulk storage"]
  },
  {
    title: "Aluminium Foil",
    label: "Food service and packaging",
    text: "Food-safe foil rolls for wrapping, baking, takeaway packing and everyday food storage with a smooth dependable finish.",
    image: "/images/foil.png",
    points: ["Food-grade material", "Heat resistant", "Retail and catering widths"]
  }
];

const capabilities = [
  ["Product Consistency", "Controlled GSM, softness and absorbency across repeat supply."],
  ["Custom Packaging", "Private-label, printed napkin and shelf-ready pack support."],
  ["Clean Handling", "Organized production and packing flows for hygiene-focused categories."],
  ["Bulk Fulfilment", "Practical supply for retail, horeca, institutions and distributors."]
];

const process = [
  ["01", "Understand", "We capture product type, quantity, ply, size, fold, branding and destination needs."],
  ["02", "Customize", "Specifications and packaging are aligned for retail shelves, horeca counters or bulk stores."],
  ["03", "Produce", "Manufacturing and finishing focus on consistent quality, clean handling and dependable output."],
  ["04", "Dispatch", "Orders are packed for smooth movement through distributor, retail and institutional channels."]
];

const sectors = ["Restaurants", "Hotels", "Hospitals", "Offices", "Retail", "Schools", "Catering", "Distributors"];

const metrics = [
  ["1-ply / 2-ply", "Tissue formats"],
  ["Retail + Bulk", "Supply models"],
  ["Custom", "Brand packaging"],
  ["India + Export", "Market support"]
];

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "RENN Products LLP",
    url: "https://www.rennproducts.com",
    email: "rennproductsllp@gmail.com",
    telephone: "+91 77384 69862",
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
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <header className="site-header" aria-label="Primary navigation">
        <a className="brand" href="#home" aria-label="RENN Products home">
          <span className="brand-mark">RENN</span>
          <span>Products LLP</span>
        </a>
        <nav>
          <a href="#about">About</a>
          <a href="#products">Products</a>
          <a href="#process">Process</a>
          <a href="#contact">Contact</a>
        </nav>
        <a className="nav-cta" href="#contact">Enquire</a>
      </header>

      <section className="hero" id="home">
        <div className="hero-copy">
          <p className="section-kicker">Made in India hygiene solutions</p>
          <h1>Smart Solution For Better Tomorrow</h1>
          <p>
            Premium tissue, napkin, roll and aluminium foil solutions for clients who need clean presentation, reliable performance and supply that feels effortless.
          </p>
          <div className="hero-actions">
            <a className="button primary" href="#products">View Products</a>
            <a className="button secondary" href="#contact">Request Quote</a>
          </div>
        </div>
        <div className="hero-showcase" aria-label="RENN product showcase">
          <div className="hero-image main">
            <Image src="/images/hero-products.png" alt="RENN tissue and aluminium foil product range" fill priority sizes="(max-width: 900px) 100vw, 52vw" />
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

      <section className="about-panel" id="about">
        <div className="about-image">
          <Image src="/images/about-operations.png" alt="RENN production and packaging operations" fill sizes="(max-width: 900px) 100vw, 46vw" />
        </div>
        <div className="about-copy">
          <p className="section-kicker">About RENN Products LLP</p>
          <h2>Built for brands that care about hygiene, finish and dependable supply.</h2>
          <p>
            RENN Products LLP manufactures everyday hygiene and food-service essentials with a practical understanding of how clients use them: on dining tables, in washrooms, on retail shelves, in kitchens and across high-volume facilities.
          </p>
          <p>
            The company supports retail, horeca, institutional and distributor requirements with flexible product specifications, custom packaging and a quality-first approach from production to dispatch.
          </p>
          <div className="capability-list">
            {capabilities.map(([title, text]) => (
              <article key={title}>
                <strong>{title}</strong>
                <span>{text}</span>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="products-section" id="products">
        <div className="section-heading split">
          <div>
            <p className="section-kicker">Product Range</p>
            <h2>Essential products, presented with a premium client-ready finish.</h2>
          </div>
          <p>
            Choose standard supply or customize ply, pack size, branding and presentation for your business model.
          </p>
        </div>
        <div className="product-showcase">
          {products.map((product, index) => (
            <article className="product-row" key={product.title}>
              <div className="product-number">{String(index + 1).padStart(2, "0")}</div>
              <div className="product-photo">
                <Image src={product.image} alt={product.title} fill sizes="(max-width: 760px) 100vw, 30vw" />
              </div>
              <div className="product-copy">
                <span>{product.label}</span>
                <h3>{product.title}</h3>
                <p>{product.text}</p>
              </div>
              <ul>
                {product.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="packaging-band">
        <div className="packaging-copy">
          <p className="section-kicker">Custom Supply Support</p>
          <h2>Packaging that works on shelves, counters and in bulk movement.</h2>
          <p>
            RENN can help clients move beyond plain supply with branded napkins, private-label tissue packs, carton-ready quantities and product combinations that suit everyday commercial use.
          </p>
          <a className="text-link" href="#contact">Discuss custom packaging</a>
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

      <section className="process-section" id="process">
        <div className="section-heading">
          <p className="section-kicker">How We Work</p>
          <h2>A clear supply process from requirement to repeat orders.</h2>
        </div>
        <div className="process-grid">
          {process.map(([number, title, text]) => (
            <article key={number}>
              <span>{number}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="story-section">
        <div className="story-copy">
          <p className="section-kicker">Our Story</p>
          <h2>Rooted in India, prepared for growing demand.</h2>
          <p>
            RENN Products LLP was created around a simple idea: everyday hygiene products should be reliable, attractive and easy for businesses to source. The brand brings together product knowledge, quality discipline and responsive service for clients who expect consistency.
          </p>
          <p>
            With a growing product range and export-ready mindset, RENN continues to support customers across India and international markets through smart, scalable hygiene solutions.
          </p>
        </div>
        <div className="story-card">
          <Image src="/images/story-renn.png" alt="RENN story visual with tissue and foil products" fill sizes="(max-width: 900px) 100vw, 40vw" />
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

      <section className="contact" id="contact">
        <div className="contact-copy">
          <p className="section-kicker">Contact Us</p>
          <h2>Send an enquiry for retail, bulk supply or custom branding.</h2>
          <p>
            Share your product requirement and RENN Products LLP will receive the enquiry directly through FormSubmit.
          </p>
          <address>
            <a href="tel:+917738469862">+91 77384 69862</a>
            <a href="tel:+917738469866">+91 77384 69866</a>
            <a href="mailto:rennproductsllp@gmail.com">rennproductsllp@gmail.com</a>
            <span>India</span>
          </address>
        </div>
        <form action="https://formsubmit.co/rennproductsllp@gmail.com" method="POST" className="enquiry-form">
          <input type="hidden" name="_subject" value="New RENN Products Website Enquiry" />
          <input type="hidden" name="_template" value="table" />
          <input type="hidden" name="_captcha" value="false" />
          <label>
            Full Name
            <input name="name" type="text" placeholder="Your name" required />
          </label>
          <label>
            Email
            <input name="email" type="email" placeholder="you@example.com" required />
          </label>
          <label>
            Phone
            <input name="phone" type="tel" placeholder="+91" required />
          </label>
          <label>
            Product Interest
            <select name="product_interest" required defaultValue="">
              <option value="" disabled>Select product</option>
              <option>Paper Napkins</option>
              <option>Facial & Table Top Tissues</option>
              <option>Toilet Rolls & Kitchen Towels</option>
              <option>Aluminium Foil</option>
              <option>Bulk / Custom Branding</option>
            </select>
          </label>
          <label className="full">
            Requirement
            <textarea name="message" rows={5} placeholder="Tell us quantity, city, packaging or branding needs" required />
          </label>
          <button type="submit">Submit Enquiry</button>
        </form>
      </section>

      <footer>
        <div>
          <strong>RENN Products LLP</strong>
          <p>Smart Solution For Better Tomorrow</p>
        </div>
        <p>Premium tissue, hygiene paper and food-safe aluminium foil solutions engineered in India.</p>
      </footer>
    </main>
  );
}
