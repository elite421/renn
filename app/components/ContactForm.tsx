import { getSiteContent } from "../lib/contentStore";

export function ContactForm({ customContent }: { customContent?: ReturnType<typeof getSiteContent> }) {
  const content = customContent || getSiteContent();
  const { contactInfo, contactPage, products } = content;

  return (
    <form action={`https://formsubmit.co/${contactInfo.email}`} method="POST" className="enquiry-form">
      <input type="hidden" name="_subject" value={`New ${content.header.brandMark} Website Enquiry`} />
      <input type="hidden" name="_template" value="table" />
      <input type="hidden" name="_captcha" value="false" />
      <label>
        {contactPage.formNameLabel || "Full Name"}
        <input name="name" type="text" placeholder="Your name" required />
      </label>
      <label>
        {contactPage.formEmailLabel || "Email"}
        <input name="email" type="email" placeholder="you@example.com" required />
      </label>
      <label>
        {contactPage.formPhoneLabel || "Phone"}
        <input name="phone" type="tel" placeholder="+91" required />
      </label>
      <label>
        {contactPage.formCategoryLabel || "Product Interest"}
        <select name="product_interest" required defaultValue="">
          <option value="" disabled>
            Select product
          </option>
          {products.map((product) => (
            <option key={product.slug}>{product.title}</option>
          ))}
          <option>Bulk / Custom Branding</option>
        </select>
      </label>
      <label className="full">
        {contactPage.formMessageLabel || "Requirement"}
        <textarea name="message" rows={5} placeholder="Tell us quantity, city, packaging or branding needs" required />
      </label>
      <button type="submit">{contactPage.formSubmitText || "Submit Enquiry"}</button>
    </form>
  );
}
