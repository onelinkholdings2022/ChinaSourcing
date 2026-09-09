import { NextResponse, type NextRequest } from "next/server";
import { revalidateTag } from "next/cache";
import { rm } from "node:fs/promises";
import path from "node:path";
import { tagsFor, slugOf } from "@/lib/cache/revalidateTags";

// ─── Webhook Strapi → bust cache theo TAG ────────────────────────────────────
//
// Mọi fetch tới Strapi đều gắn tag (xem `src/lib/repositories/strapi/*`) và
// `revalidate: 3600`, nên F5 KHÔNG nạp lại nội dung — trang phục vụ từ cache
// cho tới khi tag của nó bị thổi. Endpoint này là thứ thổi tag đó: Strapi gọi
// vào đây khi publish/unpublish và ta chỉ vô hiệu hoá đúng lát dữ liệu đã đổi,
// không đụng phần còn lại của site.
//
// Cấu hình phía Strapi — Settings → Webhooks → Create new webhook:
//   URL:     https://chinasourcing.co/api/revalidate
//   Headers: x-revalidate-secret: <REVALIDATE_SECRET>
//   Events:  Entry publish / unpublish / update / delete, Media create/update/delete
//
// Test tay:
//   GET /api/revalidate?secret=...&model=case-study&slug=byronglow
//   GET /api/revalidate?secret=...&tag=strapi          (bust tất cả)

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://chinasourcing.co").replace(/\/$/, "");

function checkSecret(req: NextRequest): NextResponse | null {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "REVALIDATE_SECRET chưa được cấu hình" }, { status: 500 });
  }
  const token = req.nextUrl.searchParams.get("secret") ?? req.headers.get("x-revalidate-secret");
  if (token !== secret) {
    return NextResponse.json({ error: "Sai token" }, { status: 401 });
  }
  return null;
}

/**
 * Xoá cache ảnh đã tối ưu nằm trên ĐĨA của Next.
 *
 * Thay một ảnh trong Strapi mà giữ nguyên URL (đổi ảnh tại chỗ trong Media
 * Library) thì Next vẫn phục vụ bản tối ưu cũ tới hết `images.minimumCacheTTL`.
 * Restart tiến trình KHÔNG dọn được vì cache nằm trên đĩa.
 *
 * ⚠️ ĐẮT: xoá sạch ảnh đã tối ưu của cả site — chỉ gọi khi media thật sự đổi.
 */
async function clearNextImageCache(): Promise<void> {
  try {
    await rm(path.join(process.cwd(), ".next", "cache", "images"), { recursive: true, force: true });
  } catch {
    /* best-effort — hỏng ở đây không được phép làm hỏng revalidate */
  }
}

async function handle(req: NextRequest): Promise<NextResponse> {
  const unauthorized = checkSecret(req);
  if (unauthorized) return unauthorized;

  let model = req.nextUrl.searchParams.get("model");
  let event = req.nextUrl.searchParams.get("event");
  let entry: Record<string, unknown> | null = null;

  if (req.method === "POST") {
    try {
      const body = (await req.json()) as { model?: unknown; event?: unknown; entry?: unknown };
      if (typeof body.model === "string") model = body.model;
      if (typeof body.event === "string") event = body.event;
      if (body.entry && typeof body.entry === "object") {
        entry = body.entry as Record<string, unknown>;
      }
    } catch {
      /* body rỗng/không hợp lệ → coi như revalidate rộng */
    }
  }

  // Override thủ công cho test: ?tag=... hoặc ?slug=...
  const forcedTag = req.nextUrl.searchParams.get("tag");
  const forcedSlug = req.nextUrl.searchParams.get("slug");
  if (forcedSlug && !entry) entry = { slug: forcedSlug };

  const tags = new Set<string>(forcedTag ? [forcedTag] : tagsFor(model, entry));

  // Next 16: `revalidateTag(tag, 'max')` — đánh dấu STALE và phục vụ bản cũ
  // trong lúc nạp lại nền (stale-while-revalidate). Dạng một tham số đã
  // deprecated và làm request kế tiếp phải chờ nạp xong mới trả.
  for (const tag of tags) revalidateTag(tag, "max");

  // Webhook media của Strapi gửi `{ event: "media.update", media: {...} }` —
  // KHÔNG có `model`, nên phải soi cả `event`. Chỉ dò `model` thì nhánh này
  // không bao giờ chạy và ảnh thay tại chỗ vẫn hiện bản cũ suốt một ngày.
  const isMedia =
    (typeof model === "string" && model.startsWith("media")) ||
    (typeof event === "string" && event.startsWith("media"));
  if (isMedia) await clearNextImageCache();

  return NextResponse.json({
    revalidated: true,
    site: SITE_URL,
    model,
    event,
    slug: slugOf(entry),
    tags: [...tags],
    clearedImages: isMedia,
    at: new Date().toISOString(),
  });
}

export async function POST(req: NextRequest) {
  return handle(req);
}

export async function GET(req: NextRequest) {
  return handle(req);
}
