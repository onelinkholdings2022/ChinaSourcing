import type { Metadata } from "next";
import { Poppins, Lora } from "next/font/google";
import "./globals.css";
import { PageTransition } from "@/components/PageTransition";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "China Sourcing Co",
  description:
    "Your Trusted Sourcing & Procurement Partner in Asia. We simplify supply chains with expert sourcing, factory partnerships, quality control and seamless logistics.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} ${lora.variable} h-full antialiased`}
    >
      {/*
       * `overflow-x-clip` rather than `-hidden`: `hidden` turns <body> into a
       * scroll container, and GSAP ScrollTrigger then resolves the scroller to
       * <body> — whose scrollTop is always 0 — so the pinned UspSlider section
       * never activates. `clip` hides the same overflow without scrolling.
       */}
      <body className="min-h-full flex flex-col overflow-x-clip">
        {/* Sits above everything at z-9999 and covers the first paint —
            must render before {children} so it is in the DOM immediately. */}
        <PageTransition />
        {children}
      </body>
    </html>
  );
}
