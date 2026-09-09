import { STRAPI_URL } from "./api/strapi-client";

// ─── PDF "Intro to China Manufacturing" ──────────────────────────────────────
// Site gốc phục vụ đúng MỘT file cho mọi nút "Download A Sourcing Guide", và
// không nút nào trong số đó là link: theme dựng tạm một `<a download>` rồi tự
// bấm, nên trình duyệt mở hộp tải xuống chứ không điều hướng.
//
// CMS không model được file này (`downloadCta` không có quan hệ media, và nút
// bên `missionVideo` thì chỉ có `label` + `url`), nên đường dẫn nằm ở env —
// xem .env.example.

const SOURCING_GUIDE_PATH = process.env.NEXT_PUBLIC_SOURCING_GUIDE_PATH || "";

/** URL tuyệt đối tới file PDF; `null` khi env chưa đặt. */
export const SOURCING_GUIDE_URL = SOURCING_GUIDE_PATH
  ? `${STRAPI_URL}${SOURCING_GUIDE_PATH}`
  : null;

/**
 * Href giữ chỗ mà CMS gắn cho nút tải hướng dẫn. Không có trang nào ở địa chỉ
 * đó — bên site gốc nút này vốn là `<button>`, không phải link — nên gặp href
 * này thì render nút tải file thay vì để proxy đá về trang chủ.
 */
export const SOURCING_GUIDE_HREF = "/sourcing-guide";

export function isSourcingGuideHref(href: string | null | undefined): boolean {
  if (!href) return false;
  return href.replace(/\/+$/, "") === SOURCING_GUIDE_HREF;
}
