import {
  EMPTY_SLUG_TABLE,
  resolveSlugOwner,
  type RouteSlugTable,
  type SlugKind,
} from "../routing/routeSlugs";

// ─── Bảng phân giải phía proxy ───────────────────────────────────────────────
// Tách khỏi `proxy.ts` để file kia chỉ còn LUẬT ĐỊNH TUYẾN. Phần này là chuyện
// khác hẳn: gọi `/api/route-slugs` và nhớ tạm kết quả.

// Cache trong tiến trình để không phải gọi lại ở mỗi lần điều hướng. Khi fetch
// hỏng ta GIỮ bảng cũ: một cú nấc của Strapi không được phép đá mọi URL bài
// viết về homepage.
let cache: { table: RouteSlugTable; at: number } | null = null;
const TTL_MS = 10_000;

// Khi cache hết hạn, nhiều request đồng thời cùng thấy hết hạn. Không chặn thì
// tất cả cùng nện vào endpoint — thundering herd. Biến này giữ đúng MỘT promise
// đang bay; request sau bám vào cùng promise đó.
let inflight: Promise<RouteSlugTable | null> | null = null;

// Một path trượt khỏi bảng đã cache thì nạp lại đúng một lần để bắt bài vừa
// publish — nhưng không dày hơn ngưỡng này, để bot dò path bậy không biến mỗi
// 404 thành một cú nện vào Strapi.
const MISS_REFRESH_THROTTLE_MS = 2_000;
let lastForcedAt = 0;

// Mặc định proxy tự gọi vào ORIGIN CÔNG KHAI của chính nó — tức là vòng ra CDN
// rồi quay lại: chậm, và phụ thuộc cache biên. Đặt `INTERNAL_BASE_URL`
// (vd http://127.0.0.1:3000) để gọi thẳng Node server.
const INTERNAL_BASE_URL = process.env.INTERNAL_BASE_URL;

async function fetchFrom(base: string): Promise<RouteSlugTable | null> {
  try {
    // Fetch TRẦN, không kèm `next: { revalidate/tags }`: proxy chạy ở runtime
    // riêng nên tuỳ chọn Data Cache của Next không có hiệu lực ở đây. Việc tiết
    // chế đã do `cache` (TTL 10s) lo rồi.
    const res = await fetch(`${base}/api/route-slugs`, { cache: "no-store" });
    if (!res.ok) return null;
    const json = (await res.json()) as Partial<Record<SlugKind, unknown>>;
    const table = { ...EMPTY_SLUG_TABLE };
    for (const key of Object.keys(EMPTY_SLUG_TABLE) as SlugKind[]) {
      const list = json[key];
      if (Array.isArray(list)) table[key] = list.filter((s): s is string => typeof s === "string");
    }
    return table;
  } catch {
    return null;
  }
}

/**
 * Lấy bảng, ưu tiên cổng nội bộ rồi LÙI VỀ origin công khai.
 *
 * Bước lùi là bắt buộc: `INTERNAL_BASE_URL` gắn cứng một cổng, nên chạy dev ở
 * cổng khác là mọi lần gọi đều `ECONNREFUSED` và TOÀN BỘ URL chi tiết bị đá về
 * homepage. Định tuyến của cả site không được chết vì một biến môi trường lệch.
 */
async function load(origin: string): Promise<RouteSlugTable | null> {
  for (const base of INTERNAL_BASE_URL ? [INTERNAL_BASE_URL, origin] : [origin]) {
    const table = await fetchFrom(base);
    if (table) {
      cache = { table, at: Date.now() };
      return table;
    }
    if (process.env.NODE_ENV !== "production") {
      console.error("[proxy] không lấy được /api/route-slugs từ", base);
    }
  }
  return null;
}

async function getTable(origin: string): Promise<RouteSlugTable> {
  if (cache && Date.now() - cache.at < TTL_MS) return cache.table;

  if (inflight) {
    const result = await inflight;
    // Luôn ưu tiên bảng cũ (dù quá hạn) hơn bảng rỗng — Strapi nấc thì mất BÀI
    // MỚI, nhưng bài cũ vẫn sống.
    return result ?? cache?.table ?? EMPTY_SLUG_TABLE;
  }

  inflight = load(origin);
  try {
    return (await inflight) ?? cache?.table ?? EMPTY_SLUG_TABLE;
  } finally {
    inflight = null;
  }
}

/** Loại nội dung sở hữu một segment ở gốc — `null` khi không ai. */
export async function resolveSegment(origin: string, seg: string): Promise<SlugKind | null> {
  const hit = resolveSlugOwner(await getTable(origin), seg);
  if (hit) return hit;

  if (Date.now() - lastForcedAt < MISS_REFRESH_THROTTLE_MS) return null;
  lastForcedAt = Date.now();
  const fresh = await load(origin);
  return fresh ? resolveSlugOwner(fresh, seg) : null;
}

/**
 * Mã chuyển hướng cho nhánh cuối của proxy (segment không khớp gì → homepage).
 *
 * 301 CHỈ khi đã đọc được bảng — đó mới là "404 xác định". Chưa đọc được thì ta
 * đang mù: mọi URL bài viết trông như 404, và 301 lúc đó là trình duyệt lẫn CDN
 * NHỚ VĨNH VIỄN. F5 hay hard-reload đều không gỡ, phải xoá cache trình duyệt.
 */
export function homeRedirectStatus(): 301 | 307 {
  return cache !== null ? 301 : 307;
}
