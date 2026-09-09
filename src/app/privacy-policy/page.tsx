import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { TextBlock } from "@/components/sections/legal/TextBlock";
import { privacyPolicyPageController, globalController } from "@/lib";
import { buildTextBlockView } from "@/lib/views/legalView";
import { buildNavView, buildFooterView, buildPageMetadata } from "@/lib/views/globalView";
import { JsonLd } from "@/components/JsonLd";

export async function generateMetadata(): Promise<Metadata> {
  const { data: page } = await privacyPolicyPageController.getPage();
  return buildPageMetadata(page?.seo, {
    title: page?.title ?? "Privacy Policy",
    description: page?.intro ?? undefined,
    path: "/privacy-policy",
  });
}

/**
 * `/privacy-policy` — trang duy nhất của site chạy khuôn `.text-block`: một
 * khối chữ hẹp, không hero, không CTA. Link vào nó nằm ở đáy footer.
 */
export default async function Page() {
  const [pageResult, globalResult] = await Promise.all([
    privacyPolicyPageController.getPage(),
    globalController.getGlobal(),
  ]);

  const page = pageResult.data;
  const global = globalResult.data;

  return (
    <>
      <JsonLd seo={page?.seo} siteSeo={global?.defaultSeo} />
      <Header solid nav={global ? buildNavView(global) : undefined} />
      <main>
        {page ? (
          <TextBlock data={buildTextBlockView(page)} />
        ) : (
          <p className="container py-40 text-center">
            Không tải được nội dung trang Privacy Policy. Vui lòng thử lại sau.
          </p>
        )}
      </main>
      <Footer footer={global ? buildFooterView(global) : undefined} />
    </>
  );
}
