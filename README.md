# RENN Products LLP Website

Modern Next.js website for RENN Products LLP, built from the supplied company profile.

## Run Locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Build

```bash
npm run build
```

## Production Server

```bash
npm run build
npm start
```

`server.js` runs the built Next.js app and reads `PORT` and `HOSTNAME` from the environment when provided.

## Contact Form

The enquiry form posts to FormSubmit at `rennproductsllp@gmail.com`. FormSubmit normally sends a first-use activation email to that inbox before messages start forwarding.

## Notes

- No MySQL database is required for the current site because enquiries are handled by FormSubmit.
- Product imagery was generated from the provided company profile artwork.
- SEO metadata, Open Graph data, JSON-LD, `robots.txt`, and `sitemap.xml` are included.
