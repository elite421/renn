import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "./components/ThemeProvider";

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
        url: "/images/hero-products-fresh.png",
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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Outfit:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
