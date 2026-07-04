import { products } from "../data";

export function ContactForm() {
  return (
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
        Requirement
        <textarea name="message" rows={5} placeholder="Tell us quantity, city, packaging or branding needs" required />
      </label>
      <button type="submit">Submit Enquiry</button>
    </form>
  );
}
