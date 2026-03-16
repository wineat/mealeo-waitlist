import type { Metadata } from "next";
import { Source_Sans_3, Lora, DM_Mono } from "next/font/google";
import "./globals.css";

const sourceSans3 = Source_Sans_3({
  variable: "--font-source-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  style: ["italic"],
  display: "swap",
});

const dmMono = DM_Mono({
  variable: "--font-dm-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Mealeo — Stop counting calories.",
  description:
    "Mealeo is nutritionally complete. No more tracking macros, scanning barcodes, or guessing calories. One shake gives you exactly what your body needs.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${sourceSans3.variable} ${lora.variable} ${dmMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
