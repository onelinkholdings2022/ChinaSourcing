import { resourcesPageController } from "@/lib";
import { getMediaUrl } from "@/lib/api/media-url";
import { SOURCING_GUIDE_URL } from "@/lib/sourcingGuide";

/**
 * Tải PDF "sourcing guide" — CÙNG DOMAIN với site.
 *
 * File lấy từ Strapi: `resources-page.downloadCta.file` (sửa ở Admin → Resources
 * Page → Download CTA → File). Trống thì lùi về `NEXT_PUBLIC_SOURCING_GUIDE_PATH`.
 *
 * Vì sao không cho trình duyệt tải thẳng từ `cms.chinasourcing.co`: `<a download>`
 * bị trình duyệt BỎ QUA với link khác domain, nên PDF MỞ RA trong tab thay vì tải
 * về. Đi qua route này thì link cùng domain, và `Content-Disposition: attachment`
 * ép tải về ở mọi trình duyệt.
 *
 * Không nhận URL từ client — file do server tự đọc từ CMS, nên route này không
 * thành một proxy mở.
 */
export async function GET() {
  const { data } = await resourcesPageController.getPage();
  const file = data?.downloadCta?.file ?? null;
  const url = getMediaUrl(file) ?? SOURCING_GUIDE_URL;
  if (!url) return new Response("Sourcing guide not found", { status: 404 });

  const upstream = await fetch(url, { cache: "no-store" });
  if (!upstream.ok || !upstream.body) {
    return new Response("Sourcing guide unavailable", { status: 502 });
  }

  const name = downloadName(file?.name ?? url.split("/").pop() ?? "");
  const length = upstream.headers.get("content-length");
  return new Response(upstream.body, {
    headers: {
      "Content-Type": upstream.headers.get("content-type") || "application/pdf",
      ...(length && { "Content-Length": length }),
      // `filename*` cho tên có ký tự đặc biệt, `filename` (ASCII) cho trình duyệt cũ.
      "Content-Disposition": `attachment; filename="${name.replace(/[^\x20-\x7e]|"/g, "")}"; filename*=UTF-8''${encodeURIComponent(name)}`,
      "Cache-Control": "no-store",
      "X-Robots-Tag": "noindex",
    },
  });
}

/** Tên file khi tải về: tên trên Media Library, bỏ ký tự cấm, luôn có đuôi. */
function downloadName(raw: string): string {
  const clean = decodeURIComponent(raw).replace(/[\\/:*?"<>|]+/g, " ").trim();
  if (!clean) return "China Sourcing Guide.pdf";
  return /\.[a-z0-9]{2,5}$/i.test(clean) ? clean : `${clean}.pdf`;
}
