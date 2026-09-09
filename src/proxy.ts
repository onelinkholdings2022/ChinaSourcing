import { NextResponse, type NextRequest } from "next/server";
import { INTERNAL_PREFIX, LEGACY_PREFIXES } from "@/lib/routing/routeSlugs";
import { homeRedirectStatus, resolveSegment } from "@/lib/proxy/routingTable";

// ─── URL phẳng ───────────────────────────────────────────────────────────────
// Mọi trang chi tiết sống ở gốc: `/<slug>`. Không quan trọng nó là service,
// product, case study, resource, category hay bài blog — địa chỉ luôn có đúng
// một segment. Các thư mục route (`/services/<slug>`, `/products/<slug>`, …)
// chỉ là đường dẫn NỘI BỘ, đích của rewrite; người dùng không bao giờ thấy.
//
// Ngoại lệ là các trang DANH SÁCH: `/services`, `/products`… có thật và hiện
// đúng URL đó. Chúng nằm trong `KNOWN_EXACT` và được xét TRƯỚC luật bóc tiền
// tố, nếu không chính chúng bị luật kia nuốt.

/**
 * Path khớp đúng một trang thật trong `app/`.
 *
 * ⚠️ Thiếu một path ở đây là trang đó rơi xuống nhánh cuối và bị đá về
 * homepage. Thêm route mới ở gốc thì phải thêm vào đây.
 */
const KNOWN_EXACT = new Set<string>([
  "/",
  "/about-us",
  "/products",
  "/services",
  "/process",
  "/case-studies",
  "/resources",
  "/contact-us",
  "/privacy-policy",
]);

/** Giấu header lộ danh tính máy chủ. */
function stripHeaders(res: NextResponse): NextResponse {
  res.headers.delete("Server");
  res.headers.delete("X-Powered-By");
  return res;
}

export async function proxy(request: NextRequest): Promise<NextResponse> {
  const url = request.nextUrl;
  const pathname = url.pathname;

  // API đi thẳng — `/api/route-slugs` là thứ chính proxy này gọi, chặn nó ở đây
  // là khoá chết bản thân.
  if (pathname.startsWith("/api")) return stripHeaders(NextResponse.next());

  // File metadata / tĩnh (sitemap.xml, robots.txt, favicon.ico, icon.svg…) đi
  // thẳng. Không có luật nào ở dưới áp cho chúng, và đá một file 404 về
  // homepage thì trình duyệt nhận HTML ở chỗ nó đợi ảnh.
  if (/\.[^/]+$/.test(pathname)) return stripHeaders(NextResponse.next());

  const normalized =
    pathname !== "/" && pathname.endsWith("/") ? pathname.replace(/\/+$/, "") : pathname;

  // 1. Trang thật → để Next render.
  if (KNOWN_EXACT.has(normalized)) return stripHeaders(NextResponse.next());

  // 2. URL có tiền tố → 301 sang URL phẳng.
  //
  //    301 đúng nghĩa: bỏ tiền tố là quyết định cố định của ta, không phụ thuộc
  //    dữ liệu. Giữ cả dạng số ít (`/case-study/<slug>` — thứ site gốc phát
  //    hành, còn link ngoài internet trỏ vào) lẫn số nhiều (thư mục route mà
  //    bản clone từng để lộ).
  const segments = normalized.split("/").filter(Boolean);
  if (segments.length >= 2 && (LEGACY_PREFIXES as readonly string[]).includes(segments[0])) {
    const slug = segments[segments.length - 1];
    const dest = new URL(`/${slug}`, request.url);
    dest.search = url.search;
    return NextResponse.redirect(dest, 301);
  }

  // 3. Một segment ở gốc khớp bảng phân giải → rewrite NỘI BỘ. Thanh địa chỉ
  //    vẫn là URL phẳng.
  if (segments.length === 1) {
    const kind = await resolveSegment(url.origin, segments[0]);
    if (kind) {
      const dest = new URL(`${INTERNAL_PREFIX[kind]}/${segments[0]}`, request.url);
      dest.search = url.search;
      return stripHeaders(NextResponse.rewrite(dest));
    }
  }

  // 4. Còn lại → về homepage. Mã trả về do `homeRedirectStatus()` quyết: 301
  //    khi đã đọc được bảng (404 xác định), 307 khi đang mù.
  //
  //    `no-store` cho CẢ HAI mã, và nó bắt buộc chứ không thừa: "404 xác định"
  //    chỉ đúng TẠI THỜI ĐIỂM NÀY. Một path hôm nay chưa có — bài chưa publish,
  //    slug đang sửa dở bên CMS — ngày mai có thật, nhưng 301 thì trình duyệt đã
  //    ghi nhớ và từ đó nhảy thẳng về trang chủ mà KHÔNG hỏi server lần nào nữa.
  const home = new URL("/", request.url);
  return NextResponse.redirect(home, {
    status: homeRedirectStatus(),
    headers: { "Cache-Control": "no-store" },
  });
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|ico|css|js|mjs|woff|woff2|ttf|pdf|mp4|txt|xml|json|webmanifest)).*)",
  ],
};
