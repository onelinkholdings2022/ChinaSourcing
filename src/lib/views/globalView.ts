import type { GlobalData } from "../types/global";

// ─── View model cho Header/Footer (dùng ở mọi trang) ─────────────────────────
// Map raw Strapi -> đúng hình dữ liệu mà Header.tsx/Footer.tsx đang đọc (trước
// đây từ `@/data/site.ts` — export `nav`/`footer`).

export interface NavViewItem {
  label: string;
  href: string;
}

export function buildNavView(data: GlobalData): NavViewItem[] {
  return data.navbar.menuItems.map((item) => ({
    label: item.label ?? "",
    href: item.url ?? "#",
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
  newsletter: { heading: string; subheading: string };
  columns: FooterColumnView[];
  locations: FooterLocationView[];
  social: FooterSocialView[];
  copyright: string;
  marquee: string;
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
    },
    columns: footer.linkColumns.map((col) => ({
      title: col.title ?? "",
      links: col.links.map((l) => ({ label: l.label ?? "", href: l.url ?? "#" })),
      ...(col.hasSeeMore && col.seeMoreUrl ? { more: { label: "See more", href: col.seeMoreUrl } } : {}),
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
