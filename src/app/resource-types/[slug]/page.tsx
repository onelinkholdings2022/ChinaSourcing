import type { Metadata } from "next";
import { permanentRedirect } from "next/navigation";
import { ResourcesPageBody } from "@/components/ResourcesPage";
import { resourceTypeController } from "@/lib";
import { buildPageMetadata } from "@/lib/views/globalView";

/**
 * Trang của một loại download — URL thật là **`/<slug>`** (`/checklists`,
 * `/ebook`, `/others`, `/templates`); `app/resource-types/[slug]` chỉ là đích
 * rewrite của `src/proxy.ts`.
 *
 * Song sinh với `app/categories/[slug]`: cùng render lại thân `/resources`,
 * chỉ khác rail nào mở sẵn — category blog ở kia, tab "Free Resources" ở đây.
 *
 * ⚠️ Route này chỉ sống khi CMS đã có collection `resource-type`. Bản đang
 * chạy trên cms.chinasourcing.co thì chưa: `getRouteSlugs` trả mảng rỗng cho
 * loại này, proxy không rewrite vào đây, và rail vẫn chạy bằng enum như cũ.
 */
async function getType(slug: string) {
  const { data } = await resourceTypeController.getAll();
  return (data ?? []).find((t) => t.slug === slug) ?? null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const type = await getType(slug);
  return buildPageMetadata(type?.seo, {
    title: type?.name ?? "Resources",
    path: `/${slug}`,
  });
}

export default async function ResourceTypePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const type = await getType(slug);

  if (!type) permanentRedirect("/");

  return <ResourcesPageBody activeResourceType={slug} seo={type.seo} />;
}
