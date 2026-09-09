import type { Metadata } from "next";
import { permanentRedirect } from "next/navigation";
import { ProductsPageBody } from "@/components/ProductsPage";
import { partnerController } from "@/lib";
import { buildPageMetadata } from "@/lib/views/globalView";
import type { PartnerCategory } from "@/lib/types/partner";

/**
 * Trang của một partner category — URL thật là **`/<slug>`**, phẳng như mọi
 * trang chi tiết khác; `app/partner-categories/[slug]` chỉ là đích rewrite của
 * `src/proxy.ts`.
 *
 * Nội dung y hệt `/products`, khác mỗi chỗ dải logo nhà máy mở sẵn đúng ngành
 * này. Đó là điều kiện để "bấm tab thì URL đổi theo": nếu trang này là một bố
 * cục khác thì bấm tab sẽ giống nhảy sang trang khác chứ không giống lọc.
 *
 * ⚠️ Chỉ BA trong bảy slug đi vào đây. Bốn slug còn lại — `point-of-sale`,
 * `gym-fitness`, `hospitality-items`, `household-appliances` — trùng tên với
 * một trang product và `SLUG_KINDS` cho product thắng, nên `/point-of-sale` ra
 * trang sản phẩm chứ không phải file này. Có chủ ý: hai thứ nói về cùng một
 * ngành, và trang product là trang có nội dung thật.
 */
async function getCategory(slug: string): Promise<PartnerCategory | null> {
  // Không có repository riêng cho partner category: deep populate của Strapi
  // trả kèm `category` (và `category.seo`) ngay trong `/api/partners`, nên hỏi
  // thêm một endpoint nữa chỉ để lấy cùng dữ liệu là thừa một request trên
  // đường nóng của `/products`.
  const { data } = await partnerController.getAll();
  for (const partner of data ?? []) {
    if (partner.category?.slug === slug) return partner.category;
  }
  return null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategory(slug);
  return buildPageMetadata(category?.seo, {
    title: category?.name ?? "Products",
    path: `/${slug}`,
  });
}

export default async function PartnerCategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = await getCategory(slug);

  // Proxy chỉ rewrite vào đây khi slug CÓ trong bảng, nên nhánh này gần như
  // không chạy — trừ lúc bảng vừa cũ đi hoặc khi ai đó gõ thẳng
  // `/partner-categories/<slug>`. Về homepage, đúng luật 404 của site.
  if (!category) permanentRedirect("/");

  return <ProductsPageBody activePartner={slug} seo={category.seo} />;
}
