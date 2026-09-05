import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WpContent } from "@/components/WpContent";
import { collections, renderedBodies } from "@/lib/content";

/**
 * The ACF-built landing pages (About Us, Products, Services, Process,
 * Case Studies, Resources, Contact Us). Their layouts live entirely in the
 * migrated markup, so the route only supplies the chrome.
 */
export function LandingPage({ slug }: { slug: string }) {
  const body = renderedBodies.landing[slug];
  if (!body) notFound();

  return (
    <>
      <Header solid />
      <main className="pt-28 lg:pt-32">
        <WpContent html={body} />
      </main>
      <Footer />
    </>
  );
}

export function landingMetadata(slug: string): Metadata {
  const page = collections.pages.find((p) => p.slug === slug);
  return {
    title: page ? `${page.title} | China Sourcing Co` : "China Sourcing Co",
    description: page?.excerpt || undefined,
  };
}
