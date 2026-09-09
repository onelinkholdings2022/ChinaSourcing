import { jsonLd } from "@/lib/seo/metadata";
import type { StrapiSeo } from "@/lib/types/strapi";

/**
 * `<script type="application/ld+json">` dựng từ field `structuredData` của
 * `shared.seo`.
 *
 * Đây là field duy nhất của component SEO mà `generateMetadata()` không chuyển
 * tải được: Metadata API của Next phát ra thẻ `<meta>`/`<link>`, không phát ra
 * `<script>`. Nên nó phải là một node trong cây render — và vì thế mọi trang
 * đều gọi component này ngay dưới `<main>`.
 *
 * Không có dữ liệu thì không render gì (`jsonLd` trả `null`), nên trang nào
 * chưa điền field bên CMS thì HTML không có gì thay đổi.
 *
 * `structuredData` là JSON do biên tập viên nhập; `jsonLd()` escape `<` để một
 * chuỗi chứa `</script>` không thoát ra khỏi thẻ.
 */
export function JsonLd({
  seo,
  siteSeo,
}: {
  seo?: StrapiSeo | null;
  siteSeo?: StrapiSeo | null;
}) {
  const data = jsonLd(seo, siteSeo);
  if (!data) return null;
  return (
    <script
      type="application/ld+json"
      // Chuỗi đã escape trong `jsonLd()`.
      dangerouslySetInnerHTML={{ __html: data }}
    />
  );
}
