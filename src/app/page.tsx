import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/sections/Hero";
import { Services } from "@/components/sections/Services";
import { UspSlider } from "@/components/sections/UspSlider";
import { CaseStudies } from "@/components/sections/CaseStudies";
import { Partners } from "@/components/sections/Partners";
import { Insights } from "@/components/sections/Insights";
import { ClosingCta } from "@/components/sections/ClosingCta";
import { LogoMarquee } from "@/components/sections/LogoMarquee";
import { Faq } from "@/components/sections/Faq";
import {
  homepageController,
  globalController,
  caseStudyController,
  blogPostController,
  partnerController,
  aboutPageController,
} from "@/lib";
import {
  buildHeroView,
  buildServiceTabsView,
  buildUspsView,
  buildCaseStudiesView,
  buildPartnerTabsView,
  buildInsightsView,
  buildFaqsView,
  buildMissionVideoView,
  buildClientLogosView,
} from "@/lib/views/homeView";
import { buildNavView, buildFooterView, buildPageMetadata } from "@/lib/views/globalView";
import { getMediaUrl } from "@/lib/api/media-url";
import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { getRouteSlugs } from "@/lib/routing/routeSlugs";

export async function generateMetadata(): Promise<Metadata> {
  const { data: page } = await homepageController.getPage();
  const hero = page?.hero;
  return buildPageMetadata(page?.seo, {
    // Hero là dòng chữ chạy (`rotatingWords`), nên `title` một mình chưa thành
    // câu. Ghép `title` + `subtitle` cho ra đúng thứ trang thật đang nói.
    title: [hero?.title, hero?.subtitle].filter(Boolean).join(" ") || "China Sourcing Co",
    description: hero?.subtitle,
    image: getMediaUrl(hero?.posterImage),
    path: "/",
  });
}

export default async function Home() {
  const [
    homeResult,
    globalResult,
    caseStudiesResult,
    postsResult,
    partnersResult,
    logosResult,
    slugTable,
  ] = await Promise.all([
    homepageController.getPage(),
    globalController.getGlobal(),
    caseStudyController.getFeatured(),
    blogPostController.getLatest(3),
    partnerController.getAll(),
    aboutPageController.getClientLogos(),
    // Dải logo nhà máy ở đây là ĐÚNG khối trên `/products`, tab cũng là link
    // tới `/<partner-category-slug>` — nên trang chủ cũng cần bảng slug để
    // dựng href.
    getRouteSlugs(),
  ]);

  const home = homeResult.data;
  const global = globalResult.data;
  const caseStudies = caseStudiesResult.data ?? [];
  const posts = postsResult.data ?? [];
  const partners = partnersResult.data ?? [];

  // Strapi tạm không truy cập được (mạng/timeout) — dựng lại đúng behaviour cũ
  // thay vì trang trắng, để lỗi hạ tầng không kéo theo lỗi hiển thị.
  if (!home) {
    return (
      <>
        <Header />
        <main>
          <p className="container py-40 text-center">
            Không tải được nội dung trang chủ. Vui lòng thử lại sau.
          </p>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <JsonLd seo={home?.seo} siteSeo={global?.defaultSeo} />
      <Header nav={global ? buildNavView(global) : undefined} />
      <main>
        <Hero hero={buildHeroView(home)} />
        <Services serviceTabs={buildServiceTabsView(home)} />
        <UspSlider usps={buildUspsView(home)} />
        <CaseStudies caseStudies={buildCaseStudiesView(caseStudies)} />
        <Partners tabs={buildPartnerTabsView(partners, slugTable)} />
        <Insights insights={buildInsightsView(posts)} />
        <ClosingCta missionVideo={buildMissionVideoView(home)} />
        <LogoMarquee clientLogos={buildClientLogosView(logosResult.data)} />
        <Faq items={buildFaqsView(home)} />
      </main>
      <Footer footer={global ? buildFooterView(global) : undefined} />
    </>
  );
}
