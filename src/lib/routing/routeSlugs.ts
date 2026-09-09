import { strapiClient } from "../api/strapi-client";

/**
 * Hình dữ liệu hẹp cho truy vấn chỉ-lấy-slug.
 *
 * Không dùng `StrapiList<T>` của `types/strapi.ts` vì `meta` ở đó là `unknown`,
 * mà ở đây cần đúng `pageCount` để biết còn trang nào không.
 */
interface SlugPage {
  data: { slug?: string | null }[];
  meta?: { pagination?: { pageCount?: number } };
}

// ─── Bảng phân giải URL phẳng ────────────────────────────────────────────────
// Mọi trang chi tiết của site sống ở GỐC: `/<slug>`. Các thư mục route
// (`app/services/[slug]`, `app/products/[slug]`, …) chỉ là đường dẫn NỘI BỘ,
// đích của rewrite trong `src/proxy.ts` — người dùng không bao giờ thấy chúng.
//
// File này là nguồn sự thật cho "slug nào thuộc về ai". Hai chỗ đọc nó:
//   • `/api/route-slugs`  → proxy gọi để biết rewrite đi đâu.
//   • view của listing     → để dựng href cho tab lọc category.
// Cùng một hàm, cùng một thứ tự ưu tiên, nên hai bên không thể lệch nhau.

/** Loại nội dung sở hữu một slug ở gốc. Thứ tự khai báo = thứ tự ưu tiên. */
export const SLUG_KINDS = [
  "service",
  "product",
  "case-study",
  "resource",
  "category",
  // Đứng SAU `product` là có chủ đích. 4/7 partner category trùng slug với một
  // product (`point-of-sale`, `gym-fitness`, `hospitality-items`,
  // `household-appliances`) và đó là CÙNG một khái niệm, không phải va chạm cần
  // gỡ: "Point of Sale" trong dải logo nhà máy và trang sản phẩm Point of Sale
  // nói về đúng một ngành. Nên `/point-of-sale` để trang product nhận — nó là
  // trang có nội dung thật — còn 3 slug còn lại (`furniture-interior`,
  // `promotional-products`, `machinery`) rơi vào `app/partner-categories/[slug]`.
  "partner-category",
  "resource-type",
  "blog-post",
] as const;

export type SlugKind = (typeof SLUG_KINDS)[number];

/** Thư mục route nội bộ của từng loại. `blog-post` nằm ở `app/[slug]`. */
export const INTERNAL_PREFIX: Record<SlugKind, string> = {
  service: "/services",
  product: "/products",
  "case-study": "/case-studies",
  resource: "/resources",
  category: "/categories",
  "partner-category": "/partner-categories",
  "resource-type": "/resource-types",
  "blog-post": "",
};

/**
 * Đường dẫn CÔNG KHAI cũ của từng loại, cả số ít lẫn số nhiều.
 *
 * Số ít là thứ site gốc phát hành (`/case-study/<slug>`); số nhiều là thư mục
 * route mà bản clone từng để lộ ra. Cả hai giờ 301 về `/<slug>`.
 *
 * `category` có mặt vì WordPress bên site gốc CÓ trang archive thật ở đó —
 * `/category/manufacturing`, `/category/ecommerce`, `/category/logistics-tips`
 * và `/category/freight-logistics` đều đang trả 200. Không khai ở đây thì bốn
 * URL đó rơi xuống nhánh cuối của proxy và bị đá về trang chủ, tức vứt sạch tín
 * hiệu SEO của mọi link cũ trỏ vào chúng. `categories` là chuyện khác: thư mục
 * route nội bộ của bản clone.
 */
export const LEGACY_PREFIXES = [
  "case-study",
  "case-studies",
  "product",
  "products",
  "service",
  "services",
  "resource",
  "resources",
  "category",
  "categories",
  "partner-category",
  "partner-categories",
  "resource-type",
  "resource-types",
] as const;

/**
 * Đưa một href do CMS nhập về đúng dạng site đang phát hành.
 *
 * Link trong `global.footer` được nhập từ hồi site còn URL có tiền tố:
 * `/product/furniture`, `/service/sourcing-service`, `/about-us/`. Cả hai kiểu
 * đều CÒN CHẠY — proxy 301 chúng — nhưng mỗi cú bấm là một lượt chuyển hướng
 * thừa, và trên di động thì thấy rõ. Chuẩn hoá ở tầng view thay vì sửa tay từng
 * link bên CMS: biên tập viên gõ kiểu nào cũng ra đúng URL.
 *
 * Chỉ động vào đường dẫn nội bộ có ĐÚNG hai segment và segment đầu là một tiền
 * tố cũ. `/about-us/` chỉ bị cắt dấu `/` cuối; link ngoài giữ nguyên.
 */
export function flattenInternalHref(href: string | null | undefined): string {
  const raw = (href ?? "").trim();
  if (!raw || !raw.startsWith("/")) return raw;

  const [path, ...rest] = raw.split(/(?=[?#])/);
  const suffix = rest.join("");
  const segments = path.split("/").filter(Boolean);

  if (segments.length === 2 && (LEGACY_PREFIXES as readonly string[]).includes(segments[0])) {
    return `/${segments[1]}${suffix}`;
  }
  return `/${segments.join("/")}${suffix}`;
}

export type RouteSlugTable = Record<SlugKind, string[]>;

const EMPTY_TABLE: RouteSlugTable = {
  service: [],
  product: [],
  "case-study": [],
  resource: [],
  category: [],
  "partner-category": [],
  "resource-type": [],
  "blog-post": [],
};

/** Endpoint + tag cache cho từng loại. Tag khớp `revalidateTags.ts`. */
const SOURCES: Record<SlugKind, { path: string; tag: string }> = {
  service: { path: "/services", tag: "service" },
  product: { path: "/products", tag: "product" },
  "case-study": { path: "/case-studies", tag: "case-study" },
  resource: { path: "/resources", tag: "resource" },
  category: { path: "/categories", tag: "category" },
  "partner-category": { path: "/partner-categories", tag: "partner-category" },
  // ⚠️ `resource-type` là collection MỚI, và bản Strapi đang chạy trên
  // cms.chinasourcing.co chưa có nó — endpoint trả 404 cho tới khi strapi-cns
  // được deploy. `fetchSlugs` nuốt lỗi và trả mảng rỗng, nên tới lúc đó rail
  // "Free Resources" chỉ không có href; không có gì vỡ. Deploy xong là 4 URL
  // (`/checklists`, `/ebook`, `/others`, `/templates`) tự sống.
  "resource-type": { path: "/resource-types", tag: "resource-type" },
  "blog-post": { path: "/blog-posts", tag: "blog-post" },
};

/**
 * Chỉ lấy `slug`, và lấy HẾT.
 *
 * ⚠️ `populate=` RỖNG là bắt buộc, không phải thừa. Controller bên Strapi gắn
 * `buildDeepPopulate` cho mọi `find` và chỉ bỏ qua khi query ĐÃ có `populate`
 * (`strapi-cns/src/utils/deep-populate.ts`), nên `fields[0]=slug` một mình
 * không cắt được gì: Strapi vẫn trả nguyên cây, và 131 blog post ra **25MB** —
 * quá 2MB nên Next còn không cache nổi, mỗi lượt render lại tải lại từ đầu.
 * Thêm `populate=` thì cùng truy vấn đó còn vài KB.
 *
 * Trang nào cũng đi qua proxy nên đây là đường nóng nhất của site.
 */
async function fetchSlugs(kind: SlugKind): Promise<string[]> {
  const { path, tag } = SOURCES[kind];
  const out: string[] = [];
  for (let page = 1; page <= 20; page++) {
    const json = await strapiClient.get<SlugPage>(
      `${path}?fields[0]=slug&populate=&pagination[page]=${page}&pagination[pageSize]=100`,
      { revalidate: 3600, tags: ["strapi", tag] },
    );
    if (!json) break;
    for (const row of json.data ?? []) if (row.slug) out.push(row.slug);
    const pageCount = json.meta?.pagination?.pageCount ?? 1;
    if (page >= pageCount) break;
  }
  return out;
}

/**
 * Toàn bộ bảng slug. Sáu request song song, tất cả đi qua Data Cache của Next
 * (tag) nên webhook Strapi làm mới ngay khi có bài mới.
 */
export async function getRouteSlugs(): Promise<RouteSlugTable> {
  const entries = await Promise.all(
    SLUG_KINDS.map(async (kind) => [kind, await fetchSlugs(kind)] as const),
  );
  return Object.fromEntries(entries) as RouteSlugTable;
}

/**
 * Ai sở hữu `slug` ở gốc — `null` nếu không ai.
 *
 * ⚠️ Thứ tự trong `SLUG_KINDS` là thứ tự ưu tiên, và nó có VA CHẠM THẬT:
 * `freight-logistics` vừa là một **service** vừa là một **category** blog.
 * Service thắng, vì đó là trang bán hàng site gốc đang phát hành
 * (`chinasourcing.co/service/freight-logistics`), còn category chỉ là bộ lọc
 * của listing. Category bị che vẫn có URL riêng — xem `categoryHref`.
 */
export function resolveSlugOwner(table: RouteSlugTable, slug: string): SlugKind | null {
  for (const kind of SLUG_KINDS) if (table[kind].includes(slug)) return kind;
  return null;
}

/**
 * URL của một category.
 *
 * Bình thường là URL phẳng `/<slug>`. Khi slug đã bị một loại ưu tiên cao hơn
 * chiếm (hiện chỉ `freight-logistics`), lùi về `/resources?category=<slug>` —
 * `/resources` đọc query đó và mở đúng tab. Không hardcode slug nào: chỉ so với
 * bảng, nên hết va chạm là tự động thành phẳng trở lại.
 */
export function categoryHref(table: RouteSlugTable, slug: string): string {
  return resolveSlugOwner(table, slug) === "category"
    ? `/${slug}`
    : `/resources?category=${encodeURIComponent(slug)}`;
}

/**
 * URL phẳng của một tab lọc — `undefined` khi slug đó chưa phân giải được.
 *
 * Dùng cho rail partner (`Partners`) và rail Free Resources
 * (`ResourceListing`). Khác `categoryHref` ở chỗ KHÔNG có nhánh lùi về query
 * param: mọi slug ở đây hoặc có trang thật, hoặc chưa có gì cả.
 *
 * • Partner category: cả 7 đều phân giải — 3 vào `app/partner-categories/[slug]`,
 *   4 còn lại vào chính trang product cùng tên (xem chú thích ở `SLUG_KINDS`).
 * • Resource type: bảng còn RỖNG cho tới khi strapi-cns được deploy, nên hàm
 *   trả `undefined` và `TabRail` render pill thành `<button>` như trước —
 *   đúng hành vi cũ, không phải một link gãy. Không được bỏ chốt này: đẩy
 *   `history.pushState('/checklists')` khi proxy chưa phân giải được slug đó là
 *   người dùng F5 một phát bị đá về trang chủ.
 */
export function filterTabHref(table: RouteSlugTable, slug: string): string | undefined {
  return resolveSlugOwner(table, slug) ? `/${slug}` : undefined;
}

export { EMPTY_TABLE as EMPTY_SLUG_TABLE };
