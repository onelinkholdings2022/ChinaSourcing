import { STRAPI_URL } from "../api/strapi-client";

// ─── Tiện ích dùng chung giữa các view builder ───────────────────────────────
// Nội dung CKEditor (FAQ answer, blog/resource content...) luôn bọc trong HTML
// (tối thiểu `<p>...</p>`), trong khi nhiều component (Faq, ...) render answer
// dưới dạng text thuần — stripHtml() rút về đúng hình đó.

export function stripHtml(html: string | null | undefined): string {
  if (!html) return "";
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&hellip;/g, "…")
    .replace(/&amp;/g, "&")
    .replace(/&#8217;/g, "’")
    .replace(/&#8220;/g, "“")
    .replace(/&#8221;/g, "”")
    .replace(/\s+/g, " ")
    .trim();
}

export function estimateReadTime(html: string | null | undefined): string {
  const words = stripHtml(html).split(" ").filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} min read`;
}

export function formatDate(iso: string | null | undefined): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return `${dd}/${mm}/${d.getFullYear()}`;
}

/**
 * Nội dung blog-post/resource giữ nguyên markup của plugin "Easy Table of
 * Contents" từ WordPress gốc: mỗi heading được bọc
 * `<span class="ez-toc-section" id="…"></span>…<span class="ez-toc-section-end">`.
 * Đọc lại đúng id đó thay vì tự sinh slug mới — anchor `#id` trong HTML và
 * trong mục lục phải khớp nhau.
 */
export function extractToc(html: string | null | undefined): { href: string; label: string }[] {
  if (!html) return [];
  const re = /<span class="ez-toc-section" id="([^"]+)"><\/span>([\s\S]*?)<span class="ez-toc-section-end">/g;
  const items: { href: string; label: string }[] = [];
  let match: RegExpExecArray | null;
  while ((match = re.exec(html))) {
    const label = stripHtml(match[2]).trim();
    if (label) items.push({ href: `#${match[1]}`, label });
  }
  return items;
}

/**
 * Rich text lưu ảnh của Media Library dưới đường dẫn TƯƠNG ĐỐI (`/uploads/…`)
 * để không hardcode host của Strapi vào DB — cùng một bản ghi phải chạy được ở
 * cả local lẫn production. `dangerouslySetInnerHTML` thì lại render nguyên xi,
 * và `/uploads/…` sẽ trỏ về chính domain của Next (404). Ghép origin của Strapi
 * vào ngay trước khi render.
 *
 * Ảnh scrape từ WordPress vẫn để URL tuyệt đối `https://chinasourcing.co/…` và
 * không bị đụng tới.
 */
export function resolveContentMedia(html: string | null | undefined): string {
  if (!html) return "";
  return html.replace(/(src|srcset)="(\/uploads\/)/g, `$1="${STRAPI_URL}$2`);
}

/**
 * Theme cắt mọi excerpt in trên thẻ bài về 150 ký tự, lùi lại tới khoảng trắng
 * gần nhất rồi nối "..." (đúng hành vi `wp_html_excerpt`) — thẻ `.resource-card`
 * không có `line-clamp` nên nếu không cắt, thẻ cao thêm cả trăm pixel so với
 * bản gốc.
 */
export function trimExcerpt(text: string, limit = 150): string {
  if (text.length <= limit) return text;
  const cut = text.slice(0, limit);
  const lastSpace = cut.lastIndexOf(" ");
  return (lastSpace > 0 ? cut.slice(0, lastSpace) : cut) + "...";
}

/**
 * Như `stripHtml` nhưng GIỮ ngắt dòng.
 *
 * Câu trả lời FAQ lưu trong Strapi là nhiều thẻ `<p>`; theme render chúng thành
 * `văn bản<br><br>văn bản`, tức một dòng trống giữa hai đoạn. `stripHtml` gộp
 * mọi khoảng trắng về một dấu cách nên dòng trống đó biến mất và panel thấp đi
 * đúng 24px. Component `Faq` đã có sẵn `whitespace-pre-line` cho việc này.
 */
export function stripHtmlKeepBreaks(html: string | null | undefined): string {
  if (!html) return "";
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>\s*<p[^>]*>/gi, "\n\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&hellip;/g, "…")
    .replace(/&amp;/g, "&")
    .replace(/&#8217;/g, "\u2019")
    .replace(/&#8220;/g, "\u201C")
    .replace(/&#8221;/g, "\u201D")
    .replace(/[^\S\n]+/g, " ")
    .replace(/[ \t]*\n[ \t]*/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
