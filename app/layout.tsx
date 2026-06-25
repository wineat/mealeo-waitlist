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
  title: "Mealeo | A Complete Meal for busy days",
  description:
    "A complete meal in seconds. 30g protein, complex carbs, essential fats, fibre and 26 vitamins & minerals. Just scoop, shake and sip.",
  icons: {
    icon: "/favicon2-new.png",
    apple: "/favicon2-new.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${newsreader.variable} ${instrumentSans.variable}`}>
        {children}
      </body>
    </html>
  );
}
