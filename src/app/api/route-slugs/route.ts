import { NextResponse } from "next/server";
import { getRouteSlugs } from "@/lib/routing/routeSlugs";

// ─── Bảng phân giải URL phẳng, cho `src/proxy.ts` ────────────────────────────
//
// Proxy chạy ở runtime RIÊNG, tách khỏi mã render: nó không import được
// controller, không dùng được Data Cache của Next, và Next khuyến cáo thẳng là
// đừng dựa vào module/biến dùng chung (xem `docs/01-app/.../proxy.md`). Nên
// đường duy nhất để proxy biết `/incoterms-explained` là bài viết còn
// `/furniture` là sản phẩm, là hỏi qua HTTP — đúng chỗ này.
//
// Ở phía server thì `getRouteSlugs()` vẫn đi qua tag cache, nên endpoint này
// gần như không bao giờ chạm tới Strapi; `src/lib/proxy/routingTable.ts` còn
// nhớ tạm thêm 10 giây nữa ở phía proxy.
//
// CÔNG KHAI có chủ đích: nội dung này đã nằm hết trong sitemap và trong HTML
// của trang listing, không lộ thêm gì.

export const revalidate = 300;

export async function GET() {
  const table = await getRouteSlugs();
  return NextResponse.json(table, {
    headers: {
      // Cho phép biên cache 5 phút, nhưng vẫn phục vụ bản cũ trong lúc làm mới:
      // bảng định tuyến hỏng là cả site rơi về homepage, thà hơi cũ còn hơn.
      "Cache-Control": "public, s-maxage=300, stale-while-revalidate=3600",
    },
  });
}
