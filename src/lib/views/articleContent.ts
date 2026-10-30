import { flattenInternalHref } from "../routing/routeSlugs";

/**
 * Biến đổi THUẦN trên HTML thân bài (CKEditor) — không gọi mạng.
 *
 * Hai việc:
 *  1. Phân loại mọi `<a>`: link nội bộ (về chính site) và link ngoài — mỗi loại
 *     một kiểu chữ riêng theo thiết kế, và link nội bộ được gắn `data-preview`
 *     để popup xem trước biết trang đích.
 *  2. Tách thân bài thành các khúc HTML xen kẽ khung CTA (`article-cta`) tại
 *     đúng vị trí biên tập viên chèn trong CKEditor.
 */

/** Domain của site gốc — nội dung scrape từ WordPress lưu link tuyệt đối về đây. */
const SITE_HOST_RE = /^https?:\/\/(?:www\.)?chinasourcing\.co(?=\/|$|[?#])/i;

export type ArticleBlock =
  | { type: "html"; html: string }
  | { type: "cta"; slug: string };

function getAttr(attrs: string, name: string): string | null {
  const m = new RegExp(`\\s${name}\\s*=\\s*("([^"]*)"|'([^']*)')`, "i").exec(attrs);
  return m ? (m[2] ?? m[3] ?? "") : null;
}

function dropAttr(attrs: string, name: string): string {
  return attrs.replace(new RegExp(`\\s${name}\\s*=\\s*("[^"]*"|'[^']*')`, "gi"), "");
}

function setAttr(attrs: string, name: string, value: string): string {
  return `${dropAttr(attrs, name)} ${name}="${value.replace(/"/g, "&quot;")}"`;
}

function addClass(attrs: string, cls: string): string {
  const existing = getAttr(attrs, "class");
  return setAttr(attrs, "class", existing ? `${existing} ${cls}` : cls);
}

/**
 * Đường dẫn nội bộ chuẩn hoá của một href, hoặc `null` nếu href không trỏ về
 * site. `/about-us/`, `https://chinasourcing.co/about-us` và
 * `/service/quality-control` đều ra `/about-us` / `/quality-control`.
 */
export function internalPath(href: string): string | null {
  const raw = href.trim();
  if (!raw || raw.startsWith("#") || raw.startsWith("//")) return null;
  let rest: string;
  if (raw.startsWith("/")) rest = raw;
  else if (SITE_HOST_RE.test(raw)) rest = raw.replace(SITE_HOST_RE, "") || "/";
  else return null;
  if (!rest.startsWith("/")) rest = `/${rest}`;
  // File tĩnh của WordPress (`/wp-content/uploads/x.pdf`) không phải một trang
  // của bản clone — đổi sang tương đối là link gãy. Để nguyên là link ngoài.
  const pathOnly = rest.split(/[?#]/)[0];
  if (/^\/wp-/i.test(pathOnly) || /\.[a-z0-9]{2,5}$/i.test(pathOnly)) return null;

  const flat = flattenInternalHref(rest);
  // Bỏ `/` cuối (trừ trang chủ) — proxy cũng làm vậy, và key preview phải trùng nhau.
  return flat.replace(/\/+(?=$|[?#])/, "") || "/";
}

/** Phần đường dẫn dùng làm key xem trước — bỏ query và hash. */
export function previewKey(path: string): string {
  return path.split(/[?#]/)[0] || "/";
}

/**
 * Gắn class `kw-link` (nội bộ) / `kw-ext` (ngoài) cho mọi link.
 *
 * • Nội bộ: href về dạng tương đối (để điều hướng ngay trong site, không đi vòng
 *   qua domain gốc), bỏ `target="_blank"` — thiết kế quy định link nội bộ mở
 *   cùng tab — và gắn `data-preview`.
 * • Ngoài: luôn mở tab mới, `rel="noopener noreferrer"`.
 * • Anchor trong trang (`#…`), `mailto:`, `tel:` giữ nguyên.
 *
 * Trả kèm danh sách key nội bộ để server lấy dữ liệu popup.
 */
export function decorateLinks(html: string): { html: string; internal: string[] } {
  const internal = new Set<string>();
  const out = html.replace(/<a\b([^>]*)>/gi, (whole, attrs: string) => {
    const href = getAttr(attrs, "href");
    if (href == null || /^(mailto:|tel:|#)/i.test(href.trim())) return whole;

    const path = internalPath(href);
    if (path) {
      const key = previewKey(path);
      internal.add(key);
      let a = setAttr(attrs, "href", path);
      a = dropAttr(a, "target");
      a = dropAttr(a, "rel");
      a = addClass(a, "kw-link");
      a = setAttr(a, "data-preview", key);
      return `<a${a}>`;
    }

    if (!/^https?:\/\//i.test(href.trim())) return whole;
    let a = setAttr(attrs, "target", "_blank");
    a = setAttr(a, "rel", "noopener noreferrer");
    a = addClass(a, "kw-ext");
    return `<a${a}>`;
  });
  return { html: out, internal: [...internal] };
}

// Tiêu đề mục hỏi đáp: "Frequently Asked Questions (FAQ)", "China Sourcing FAQs
// for Building Materials", "Technical FAQ: …".
const FAQ_TITLE_RE = /\bFAQs?\b|frequently\s+asked\s+questions/i;
const HEADING_RE = /<h([2-4])\b[^>]*>([\s\S]*?)<\/h\1>/gi;

/**
 * Chèn `<hr>` ngay trước tiêu đề FAQ — cùng đường kẻ biên tập viên tự đặt trước
 * "References", nên ăn đúng style `.article-prose hr` (cách trên 64px, dưới
 * 48px). Bỏ qua khi bài đã có sẵn `<hr>` ở đó, hoặc tiêu đề nằm đầu bài.
 */
export function addFaqDividers(html: string): string {
  return html.replace(HEADING_RE, (whole, _level: string, inner: string, offset: number) => {
    const text = inner.replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ");
    if (!FAQ_TITLE_RE.test(text)) return whole;
    const before = html.slice(0, offset).trimEnd();
    if (!before || /<hr\b[^>]*>$/i.test(before)) return whole;
    return `<hr>${whole}`;
  });
}

// Thẻ đánh dấu do nút "CTA Box" của CKEditor sinh ra. CKEditor có thể để `&nbsp;`
// hoặc bọc thêm khoảng trắng bên trong div rỗng.
const CTA_DIV_RE = /<div\b[^>]*\bdata-cta\s*=\s*"([^"]+)"[^>]*>(?:\s|&nbsp;)*<\/div>/gi;
// Lối tắt gõ tay — dùng được cả trong preset Markdown: một đoạn chỉ chứa `[cta:slug]`.
const CTA_SHORTCODE_RE = /<p\b[^>]*>\s*\[cta:([a-z0-9-]+)\]\s*<\/p>/gi;

/** Tách thân bài thành khúc HTML + khung CTA, giữ đúng thứ tự trong bài. */
export function splitArticleBlocks(html: string): { blocks: ArticleBlock[]; ctaSlugs: string[] } {
  const blocks: ArticleBlock[] = [];
  const slugs = new Set<string>();
  const marked = html.replace(CTA_SHORTCODE_RE, (_m, slug: string) => `<div data-cta="${slug}"></div>`);

  let last = 0;
  for (const m of marked.matchAll(CTA_DIV_RE)) {
    const before = marked.slice(last, m.index);
    if (before.trim()) blocks.push({ type: "html", html: before });
    const slug = m[1].trim();
    blocks.push({ type: "cta", slug });
    slugs.add(slug);
    last = (m.index ?? 0) + m[0].length;
  }
  const tail = marked.slice(last);
  if (tail.trim()) blocks.push({ type: "html", html: tail });

  return { blocks, ctaSlugs: [...slugs] };
}
