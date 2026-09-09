// ─── Bảng model Strapi → tag cache ───────────────────────────────────────────
// Tách khỏi `route.ts` để file route không phình: đây là bảng tra thuần, không
// đụng request. Mỗi `case` phải trả về ĐỦ mọi tag mà bản ghi đó xuất hiện —
// thiếu một tag nghĩa là sửa nội dung xong mà một trang nào đó vẫn hiện bản cũ
// cho tới lần `revalidate` kế tiếp (mặc định 1 giờ).
//
// Danh sách tag lấy từ chính các Repository trong `src/lib/repositories/strapi/`
// — sửa tag ở đây thì phải sửa cả bên đó.

/** Lấy `slug` từ entry của webhook (Strapi gửi nguyên bản ghi vừa đổi). */
export function slugOf(entry: Record<string, unknown> | null): string | null {
  const slug = entry?.slug;
  return typeof slug === "string" && slug.trim() ? slug.trim() : null;
}

/**
 * Tag cần bust cho một model + entry.
 *
 * Quy ước: collection type trả `[<tag chung>]` + `<tag chung>:<slug>` để sửa một
 * bản ghi không dựng lại cả danh sách bản ghi khác — nhưng tag chung vẫn phải có
 * mặt vì mọi trang listing (và `generateStaticParams`) đọc CẢ danh sách.
 */
export function tagsFor(model: string | null, entry: Record<string, unknown> | null): string[] {
  const slug = slugOf(entry);
  const withSlug = (base: string[], prefix: string) => (slug ? [...base, `${prefix}:${slug}`] : base);

  switch (model) {
    // ── Single type: mỗi trang một tag, khép kín ────────────────────────────
    case "homepage":
      return ["homepage"];
    case "about-us-page":
      return ["about-page"];
    case "products-page":
      return ["products-page"];
    case "services-page":
      return ["services-page"];
    case "process-page":
      return ["process-page"];
    case "case-studies-page":
      return ["case-studies-page"];
    case "resources-page":
      return ["resources-page"];
    case "contact-page":
      return ["contact-page"];
    case "privacy-policy-page":
      return ["privacy-policy-page"];
    case "contact-dialog":
      return ["contact-dialog"];

    // ── Setting: dùng chung cho TOÀN BỘ trang detail của vertical đó ────────
    case "product-setting":
      return ["product-setting", "product"];
    case "service-setting":
      return ["service-setting", "service"];
    case "case-study-setting":
      return ["case-study-setting", "case-study"];
    case "resource-setting":
      return ["resource-setting", "resource", "blog-post"];

    // ── Collection type ────────────────────────────────────────────────────
    case "product":
      // `products-page` + `services-page` cùng nhúng lưới/tab sản phẩm.
      return withSlug(["product", "products-page", "services-page"], "product");
    case "service":
      return withSlug(["service", "services-page"], "service");
    case "case-study":
      // Case study xuất hiện trên trang chủ, About, /products, /services và
      // slider "Explore more Case Studies" của mọi trang case study khác.
      return withSlug(
        ["case-study", "case-studies-page", "homepage", "about-page", "products-page", "services-page"],
        "case-study"
      );
    case "resource":
      // Khối `.resource-card` của /services và trang service detail đọc chính
      // collection này.
      return withSlug(["resource", "resources-page", "services-page", "service"], "resource");
    case "blog-post":
      // Trang chủ ("Latest Sourcing Insights") và khối `.resource-card` của
      // /services cùng đọc blog post.
      return withSlug(["blog-post", "resources-page", "homepage", "services-page", "service"], "blog-post");
    case "testimonial":
      // Testimonial hiện trên 15 trang product (`.two-column-testimonial`) và 4
      // trang service (`.tabbed-testimonial`).
      return ["testimonial", "product", "service"];
    case "partner":
      // Dải logo nhà máy chỉ nằm trên trang chủ và /products.
      return ["partner", "homepage", "products-page"];
    case "partner-category":
      // Thêm `partner-category` vì mỗi category giờ có URL riêng `/<slug>`:
      // `getRouteSlugs` đọc endpoint đó, và thiếu tag này thì thêm/xoá một
      // category bên CMS mà proxy vẫn phân giải theo bảng cũ — URL mới bị đá
      // về trang chủ tới một tiếng.
      return ["partner", "partner-category", "homepage", "products-page"];
    case "resource-type":
      // Rail "Free Resources" + bảng slug (`/checklists`, `/ebook`, …).
      return ["resource-type", "resource", "resources-page"];
    case "team-member":
      // Lưới nhân sự chỉ sống trong /about-us.
      return ["team-members", "about-page"];
    case "category":
      // Tab lọc của /resources đọc tên category, thẻ bài in nó.
      return ["category", "resource", "blog-post", "resources-page"];

    default:
      // Model lạ (gọi tay, webhook media, body rỗng) → bust rộng cho chắc.
      return ["strapi"];
  }
}
