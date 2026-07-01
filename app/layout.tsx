import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.rennproducts.com"),
  title: {
    default: "RENN Products LLP | Premium Tissue, Napkins & Aluminium Foil",
    template: "%s | RENN Products LLP"
  },
  description:
    "RENN Products LLP is an Indian manufacturer of premium tissue, paper napkins, hygiene paper products and food-safe aluminium foil for homes, offices, restaurants, hospitals and hospitality.",
  keywords: [
    "RENN Products LLP",
    "paper napkins manufacturer India",
    "tissue products supplier",
    "facial tissue",
    "toilet rolls",
    "kitchen towels",
    "aluminium foil rolls",
    "custom tissue branding"
  ],
  openGraph: {
    title: "RENN Products LLP",
    description: "Smart Solution For Better Tomorrow - premium tissue and hygiene paper solutions engineered in India.",
    url: "https://www.rennproducts.com",
    siteName: "RENN Products LLP",
    images: [
      {
        url: "/images/hero-products.png",
        width: 1400,
        height: 980,
        alt: "RENN Products tissue and hygiene product range"
      }
    ],
    locale: "en_IN",
    type: "website"
  },
  robots: {
    index: true,
    follow: true
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-IN">
      <body>{children}</body>
    </html>
  );
}
