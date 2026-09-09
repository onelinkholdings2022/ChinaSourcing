import type { Metadata } from "next";
import { ResourcesPageBody } from "@/components/ResourcesPage";
import { resourcesPageController } from "@/lib";
import { getMediaUrl } from "@/lib/api/media-url";
import { buildPageMetadata } from "@/lib/views/globalView";

export async function generateMetadata(): Promise<Metadata> {
  const { data: page } = await resourcesPageController.getPage();
  return buildPageMetadata(page?.seo, {
    title: page?.hero.heading ?? "Resources",
    description: page?.hero.description,
    image: getMediaUrl(page?.hero.image),
    path: "/resources",
  });
}

/**
 * `/resources` — bản "All" của listing.
 *
 * Thân trang nằm ở `ResourcesPageBody`, dùng chung với `/<category-slug>`.
 * Section order is the original's, with one omission: the theme also renders a
 * `.featured-resources` band ("Most Popular Blogs", a 2x2 mosaic of three
 * posts) between the hero and the downloads. It is dropped here at the owner's
 * request — all three posts are in the blog listing further down.
 *
 * `?category=<slug>` là đường lùi cho category KHÔNG có URL phẳng vì slug đã bị
 * một loại nội dung ưu tiên cao hơn chiếm — hiện chỉ `freight-logistics`, trùng
 * với một service. Xem `categoryHref` trong `lib/routing/routeSlugs.ts`.
 */
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  return <ResourcesPageBody activeCategory={category || "all"} />;
}
