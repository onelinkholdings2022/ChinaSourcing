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
import { buildNavView, buildFooterView } from "@/lib/views/globalView";

export default async function Home() {
  const [homeResult, globalResult, caseStudiesResult, postsResult, partnersResult, logosResult] =
    await Promise.all([
      homepageController.getPage(),
      globalController.getGlobal(),
      caseStudyController.getFeatured(),
      blogPostController.getLatest(3),
      partnerController.getAll(),
      aboutPageController.getClientLogos(),
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
      <Header nav={global ? buildNavView(global) : undefined} />
      <main>
        <Hero hero={buildHeroView(home)} />
        <Services serviceTabs={buildServiceTabsView(home)} />
        <UspSlider usps={buildUspsView(home)} />
        <CaseStudies caseStudies={buildCaseStudiesView(caseStudies)} />
        <Partners tabs={buildPartnerTabsView(partners)} />
        <Insights insights={buildInsightsView(posts)} />
        <ClosingCta missionVideo={buildMissionVideoView(home)} />
        <LogoMarquee clientLogos={buildClientLogosView(logosResult.data)} />
        <Faq items={buildFaqsView(home)} />
      </main>
      <Footer footer={global ? buildFooterView(global) : undefined} />
    </>
  );
}
