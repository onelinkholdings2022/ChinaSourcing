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
