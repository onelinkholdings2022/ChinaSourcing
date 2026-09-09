import type { Metadata } from "next";
import { globalController } from "../container";
import { flattenInternalHref } from "../routing/routeSlugs";
import { buildMetadata, type SeoFallback } from "../seo/metadata";
import type { GlobalData } from "../types/global";
import type { StrapiSeo } from "../types/strapi";

// ─── View model cho Header/Footer (dùng ở mọi trang) ─────────────────────────
// Map raw Strapi -> đúng hình dữ liệu mà Header.tsx/Footer.tsx đang đọc (trước
// đây từ `@/data/site.ts` — export `nav`/`footer`).

/**
 * Metadata của một trang, ghép từ `seo` của chính trang đó + `global.defaultSeo`.
 *
 * Trước đây hàm này chỉ đọc `metaTitle`/`metaDescription` và nối một chuỗi ghi
 * cứng (`"About Us | China Sourcing Co"`); bốn field còn lại của `shared.seo`
 * nhập vào CMS xong là không ai đọc. Giờ toàn bộ nằm ở `seo/metadata.ts`, và
 * `fallback` phải dựng TỪ NỘI DUNG CMS (heading của trang, tiêu đề bài) chứ
 * không phải chuỗi viết trong code.
 *
 * `getGlobal()` gọi ở đây không thành lượt fetch riêng: layout đã gọi trước đó
 * và Data Cache trả lại ngay.
 */
export async function buildPageMetadata(
  seo: StrapiSeo | null | undefined,
  fallback: SeoFallback,
): Promise<Metadata> {
  const { data: global } = await globalController.getGlobal();
  return buildMetadata(seo, global?.defaultSeo, fallback);
}

export interface NavViewItem {
  label: string;
  href: string;
}

export function buildNavView(data: GlobalData): NavViewItem[] {
  return data.navbar.menuItems.map((item) => ({
    label: item.label ?? "",
    href: flattenInternalHref(item.url) || "#",
  }));
}

export interface FooterLinkView {
  label: string;
  href: string;
}

export interface FooterColumnView {
  title: string;
  links: FooterLinkView[];
  more?: FooterLinkView;
}

export interface FooterLocationView {
  country: string;
  address: string;
  email: string;
}

export interface FooterSocialView {
  label: string;
  href: string;
}

export interface FooterViewData {
  newsletter: {
    heading: string;
    subheading: string;
    placeholder: string;
    buttonLabel: string;
    /** Null = chưa cấu hình -> Footer lùi về form tĩnh, không gửi đi đâu. */
    form: FooterNewsletterFormView | null;
  };
  columns: FooterColumnView[];
  locations: FooterLocationView[];
  social: FooterSocialView[];
  copyright: string;
  marquee: string;
}

export interface FooterNewsletterFormView {
  portalId: string;
  formId: string;
  region: string;
}

/**
 * Form đăng ký nhận tin ở footer là embed HubSpot THẬT của site gốc — cùng
 * portal `46681098` với form "Get In Touch" (deviation 22), form id
 * `e30221f0-…`. Trước đây footer render một `<form>` tự dựng không post đi
 * đâu (deviation 2), nên không ai đăng ký được.
 *
 * Nguồn ưu tiên là CMS (`global.footer.newsletterForm`); env chỉ là lưới đỡ
 * cho khi field đó trống — cùng cách mọi nội dung khác của site đọc từ Strapi.
 */
function resolveNewsletterForm(
  form: GlobalData["footer"]["newsletterForm"],
): FooterNewsletterFormView | null {
  const portalId = form?.portalId?.trim() || process.env.NEXT_PUBLIC_HUBSPOT_PORTAL_ID?.trim();
  const formId =
    form?.formId?.trim() || process.env.NEXT_PUBLIC_HUBSPOT_NEWSLETTER_FORM_ID?.trim();
  if (!portalId || !formId) return null;
  return {
    portalId,
    formId,
    region: form?.region?.trim() || process.env.NEXT_PUBLIC_HUBSPOT_REGION?.trim() || "na1",
  };
}

// `marquee` KHÔNG có field tương ứng trong schema Strapi hiện tại
// (layout.footer không có field này) — giữ nguyên bản tĩnh thay vì thêm
// schema mới cho 1 dòng copy nhỏ.
const MARQUEE_FALLBACK = "Interested in working together? Let’s discuss.";

export function buildFooterView(data: GlobalData): FooterViewData {
  const { footer } = data;
  return {
    // Footer.tsx: `heading` render nhỏ (eyebrow), `subheading` render to
    // (heading thật) — đúng thứ tự 2 field `eyebrow`/`heading` bên Strapi.
    newsletter: {
      heading: footer.newsletter?.eyebrow ?? "",
      subheading: footer.newsletter?.heading ?? "",
      placeholder: footer.newsletter?.placeholder ?? "Email*",
      buttonLabel: footer.newsletter?.buttonLabel ?? "Submit",
      form: resolveNewsletterForm(footer.newsletterForm),
    },
    columns: footer.linkColumns.map((col) => ({
      title: col.title ?? "",
      // Link footer trong CMS còn ở dạng tiền tố cũ (`/product/furniture`) và
      // có dấu `/` cuối. `flattenInternalHref` đưa về URL site đang phát hành —
      // xem chú thích của nó về lý do không sửa tay bên CMS.
      links: col.links.map((l) => ({ label: l.label ?? "", href: flattenInternalHref(l.url) || "#" })),
      ...(col.hasSeeMore && col.seeMoreUrl
        ? { more: { label: "See more", href: flattenInternalHref(col.seeMoreUrl) } }
        : {}),
    })),
    locations: footer.locations.map((loc) => ({
      country: loc.name ?? "",
      address: loc.address ?? "",
      email: loc.email ?? "",
    })),
    social: footer.socialMedia.map((s) => ({ label: s.name ?? "", href: s.url ?? "#" })),
    copyright: footer.copyright ?? "",
    marquee: MARQUEE_FALLBACK,
  };
}
