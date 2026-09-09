// Tải về mọi ảnh mà thân bài blog/resource còn trỏ tuyệt đối tới
// `https://chinasourcing.co/wp-content/...`, lưu vào `public/wp-content/...`.
//
// VÌ SAO CẦN: nội dung được cào từ WordPress và giữ nguyên URL tuyệt đối (xem
// TARGET.md deviation 25). Chừng nào `chinasourcing.co` còn là WordPress thì
// mấy URL đó vẫn sống. Ngay khi tên miền trỏ sang bản Next này, `/wp-content/*`
// không còn ai phục vụ → toàn bộ ảnh MINH HOẠ TRONG BÀI hỏng, mà trang vẫn
// trả 200 nên không có cảnh báo nào.
//
// Next phục vụ nguyên `public/` ở gốc URL, nên chỉ cần file nằm đúng chỗ là
// `/wp-content/uploads/...` chạy lại — không phải sửa nginx, không phải sửa
// nội dung bên CMS.
//
//   node scripts/mirror-wp-assets.mjs          # tải file còn thiếu
//   node scripts/mirror-wp-assets.mjs --check  # chỉ liệt kê, không tải
//
// Chạy lại nhiều lần được: file đã có thì bỏ qua.

import { mkdir, writeFile, stat } from "node:fs/promises";
import { dirname, join } from "node:path";

const CMS = process.env.NEXT_PUBLIC_STRAPI_URL || "https://cms.chinasourcing.co";
const ORIGIN = "https://chinasourcing.co";
const OUT = join(process.cwd(), "public");
const CHECK_ONLY = process.argv.includes("--check");

/** Mọi collection có thân bài WYSIWYG chứa markup cào từ WordPress. */
const COLLECTIONS = ["blog-posts", "resources", "case-studies"];

async function fetchAllContent(collection) {
  const out = [];
  for (let page = 1; ; page++) {
    const qs = new URLSearchParams({
      "pagination[pageSize]": "100",
      "pagination[page]": String(page),
      "fields[0]": "slug",
      "fields[1]": "content",
      // populate rỗng: chỉ cần 2 field trên. Thiếu nó thì controller bên CMS
      // gắn deep populate và 132 bài trả về ~25MB (xem TARGET.md deviation 42).
      populate: "",
    });
    const res = await fetch(`${CMS}/api/${collection}?${qs}`);
    if (!res.ok) throw new Error(`${collection} → HTTP ${res.status}`);
    const json = await res.json();
    out.push(...json.data);
    const p = json.meta?.pagination;
    if (!p || page >= p.pageCount) break;
  }
  return out;
}

const bytes = (n) => `${(n / 1024 / 1024).toFixed(1)} MB`;

const paths = new Set();
for (const collection of COLLECTIONS) {
  let entries;
  try {
    entries = await fetchAllContent(collection);
  } catch (err) {
    console.error(`  ! bỏ qua ${collection}: ${err.message}`);
    continue;
  }
  let hits = 0;
  for (const entry of entries) {
    const html = entry.content ?? "";
    // Bắt cả `src` lẫn `srcset` (WordPress phát nhiều biến thể kích thước),
    // cả http lẫn https, có hoặc không có `www.`.
    for (const m of html.matchAll(
      /https?:\/\/(?:www\.)?chinasourcing\.co(\/wp-content\/[^"'\s>)]+)/g,
    )) {
      // srcset ngăn bằng dấu phẩy + mô tả cỡ ("… 1024w"); cắt phần thừa.
      const path = m[1].split(",")[0].replace(/[.,;]+$/, "");
      if (!paths.has(path)) hits++;
      paths.add(path);
    }
  }
  console.log(`  ${collection}: ${entries.length} bản ghi, +${hits} file mới`);
}

console.log(`\nTổng cộng ${paths.size} file cần có mặt trong public/wp-content/.`);

let downloaded = 0;
let skipped = 0;
let failed = [];
let total = 0;

for (const path of [...paths].sort()) {
  const dest = join(OUT, path);
  try {
    const s = await stat(dest);
    skipped++;
    total += s.size;
    continue;
  } catch {
    // chưa có → tải
  }
  if (CHECK_ONLY) {
    console.log(`  THIẾU ${path}`);
    failed.push(path);
    continue;
  }
  try {
    const res = await fetch(ORIGIN + path, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; asset-mirror)" },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    await mkdir(dirname(dest), { recursive: true });
    await writeFile(dest, buf);
    downloaded++;
    total += buf.length;
  } catch (err) {
    failed.push(`${path} — ${err.message}`);
  }
}

console.log(
  CHECK_ONLY
    ? `\nĐã có: ${skipped} • Thiếu: ${failed.length}`
    : `\nTải mới: ${downloaded} • Đã có sẵn: ${skipped} • Lỗi: ${failed.length} • Dung lượng: ${bytes(total)}`,
);
if (failed.length) {
  console.log("\nKHÔNG lấy được (ảnh này sẽ hỏng sau cutover):");
  for (const f of failed) console.log("  -", f);
  process.exitCode = 1;
}
