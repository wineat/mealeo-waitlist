import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "800"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Mealeo | A Complete Meal for busy days",
  description:
    "A complete meal in seconds. 30g protein, complex carbs, essential fats, fibre and 26 vitamins & minerals. Just scoop, shake and sip.",
  icons: {
    icon: "/favicon3.png",
    apple: "/favicon3.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${dmSans.variable}`}>
        {children}
      </body>
    </html>
  );
}
