// ─── Kiểu dữ liệu Strapi dùng chung ─────────────────────────────────────────
// Chỉ chứa các shape "thô" trả về từ Strapi 5 + vài alias tiện dụng.
// Tầng Repository nhận các shape này; tầng trên (component) tiêu thụ trực tiếp.

/** Một biến thể ảnh (thumbnail/small/medium/large) do Strapi sinh. */
export interface StrapiImageFormat {
  url: string;
  width: number;
  height: number;
}

/** Media (ảnh/file) của Strapi. `null`-able ở mọi field optional. */
export interface StrapiMedia {
  id: number;
  documentId?: string;
  name?: string;
  alternativeText?: string | null;
  width?: number | null;
  height?: number | null;
  mime?: string | null;
  ext?: string | null;
  size?: number | null;
  url: string;
  formats?: Record<string, StrapiImageFormat> | null;
}

/** Component `shared.button`. */
export interface StrapiButton {
  id: number;
  label: string | null;
  url: string | null;
  variant?: "primary" | "secondary" | "outline" | "link" | null;
  openInNewTab?: boolean | null;
}

/** Component `shared.tag`. */
export interface StrapiTag {
  id: number;
  label: string | null;
}

/** Component `shared.seo`. */
export interface StrapiSeo {
  id: number;
  metaTitle?: string | null;
  metaDescription?: string | null;
  shareImage?: StrapiMedia | null;
  keywords?: string | null;
  canonicalURL?: string | null;
  structuredData?: unknown;
}

/** Bọc chuẩn của Strapi cho Single Type: `{ data, meta }`. */
export interface StrapiSingle<T> {
  data: T | null;
  meta?: unknown;
}

/** Bọc chuẩn của Strapi cho Collection Type: `{ data: T[], meta }`. */
export interface StrapiList<T> {
  data: T[];
  meta?: unknown;
}
