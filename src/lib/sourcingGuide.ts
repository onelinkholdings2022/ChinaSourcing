import { STRAPI_URL } from "./api/strapi-client";

// ─── PDF "Intro to China Manufacturing" ──────────────────────────────────────
// Site gốc phục vụ đúng MỘT file cho mọi nút "Download A Sourcing Guide", và
// không nút nào trong số đó là link: theme dựng tạm một `<a download>` rồi tự
// bấm, nên trình duyệt mở hộp tải xuống chứ không điều hướng.
//
// File nằm trên Strapi: `resources-page.downloadCta.file`. Mọi nút tải đều đi
// qua `/api/sourcing-guide` (CÙNG DOMAIN) — link thẳng sang `cms.chinasourcing.co`
// thì trình duyệt bỏ qua `download` và MỞ PDF thay vì tải về.
//
// Env `NEXT_PUBLIC_SOURCING_GUIDE_PATH` chỉ còn là dự phòng khi field file trên
// CMS để trống.

const SOURCING_GUIDE_PATH = process.env.NEXT_PUBLIC_SOURCING_GUIDE_PATH || "";

/** URL tuyệt đối tới file PDF dự phòng (env); `null` khi env chưa đặt. */
export const SOURCING_GUIDE_URL = SOURCING_GUIDE_PATH
  ? `${STRAPI_URL}${SOURCING_GUIDE_PATH}`
  : null;

/** Route cùng domain trả PDF kèm `Content-Disposition: attachment`. */
export const SOURCING_GUIDE_DOWNLOAD = "/api/sourcing-guide";

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
