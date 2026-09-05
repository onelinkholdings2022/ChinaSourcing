import type { StrapiMedia } from "../types/strapi";
import { STRAPI_URL } from "./strapi-client";

// ─── media-url — hàm đồng bộ thuần (no Promise) ──────────────────────────────
// Đổi `media.url` tương đối ("/uploads/x.webp") thành URL tuyệt đối tới Strapi.

type FormatKey = "thumbnail" | "small" | "medium" | "large";

/** URL tuyệt đối cho 1 media Strapi (optionally ở 1 format), hoặc null. */
export function getMediaUrl(media?: StrapiMedia | null, format?: FormatKey): string | null {
  if (!media) return null;
  const path = (format && media.formats?.[format]?.url) || media.url;
  if (!path) return null;
  return path.startsWith("http") ? path : `${STRAPI_URL}${path}`;
}

export function mediaWidth(media?: StrapiMedia | null): number | undefined {
  return media?.width ?? undefined;
}

export function mediaHeight(media?: StrapiMedia | null): number | undefined {
  return media?.height ?? undefined;
}

/** Alt text: ưu tiên field riêng, fallback alternativeText của media. */
export function mediaAlt(media?: StrapiMedia | null, fallback = ""): string {
  return media?.alternativeText || fallback;
}
