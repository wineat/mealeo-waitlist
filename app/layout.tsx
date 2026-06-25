import type { Metadata } from "next";
import { Newsreader, Instrument_Sans } from "next/font/google";
import "./globals.css";

const newsreader = Newsreader({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  display: "swap",
});

const instrumentSans = Instrument_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Mealeo | Complete Meals Made Easier",
  description:
    "Mealeo makes complete, balanced nutrition easier for busy days. Just scoop, shake, and get a filling meal with protein, fibre, and essential nutrients.",
  icons: {
    icon: "/favicon2-new.png",
    apple: "/favicon2-new.png",
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Mealeo Essentials Private Limited",
  "alternateName": "Mealeo",
  "legalName": "Mealeo Essentials Private Limited",
  "url": "https://mealeo.co",
  "logo": {
    "@type": "ImageObject",
    "url": "https://mealeo.co/design-logo.png"
  },
  "description": "Mealeo makes complete, balanced meals designed to make good nutrition easier. Just scoop, shake, and get a filling meal with protein, fibre, and essential nutrients.",
  "slogan": "Complete meals made easy",
  "foundingDate": "2024-12-17",
  "founders": [
    { "@type": "Person", "name": "Vineet Baburaj" },
    { "@type": "Person", "name": "Shipra Dawar" }
  ],
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Bengaluru",
    "addressRegion": "Karnataka",
    "addressCountry": "IN"
  },
  "areaServed": "IN",
  "industry": "Food & Beverage",
  "brand": {
    "@type": "Brand",
    "name": "Mealeo",
    "slogan": "Complete meals made easy"
  },
  "sameAs": [
    "https://www.instagram.com/mealeo.co/",
    "https://www.facebook.com/profile.php?id=61591250931789",
    "https://www.linkedin.com/company/mealeo"
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body className={`${newsreader.variable} ${instrumentSans.variable}`}>
        {children}
      </body>
    </html>
  );
}
