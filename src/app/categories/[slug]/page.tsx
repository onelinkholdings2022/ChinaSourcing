import type { Metadata } from "next";
import { permanentRedirect } from "next/navigation";
import { ResourcesPageBody } from "@/components/ResourcesPage";
import { categoryController } from "@/lib";
import { buildPageMetadata } from "@/lib/views/globalView";

/**
 * Trang của một category — URL thật là **`/<slug>`**, phẳng như mọi trang chi
 * tiết khác; `app/categories/[slug]` chỉ là đích rewrite của `src/proxy.ts`.
 *
 * Nội dung y hệt `/resources`, khác mỗi chỗ rail category mở sẵn đúng mục này
 * và hero lấy tiêu đề của category. Đó là điều kiện để "bấm bộ lọc thì URL đổi
 * theo": nếu trang category là một bố cục khác thì bấm tab sẽ giống nhảy sang
 * trang khác chứ không giống lọc.
 *
 * KHÔNG có `generateStaticParams`: chỉ 10 category, và chúng đổi theo dữ liệu
 * blog. Trang render on-demand rồi nằm trong cache theo tag như phần còn lại.
 */
async function getCategory(slug: string) {
  const { data } = await categoryController.getAll();
  return (data ?? []).find((c) => c.slug === slug) ?? null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategory(slug);
  return buildPageMetadata(category?.seo, {
    title: category?.name ?? "Resources",
    path: `/${slug}`,
  });
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = await getCategory(slug);

  // Proxy chỉ rewrite vào đây khi slug CÓ trong bảng, nên nhánh này gần như
  // không chạy — trừ lúc bảng vừa cũ đi (category vừa bị xoá bên CMS) hoặc khi
  // ai đó gõ thẳng `/categories/<slug>`. Về homepage, đúng luật 404 của site.
  if (!category) permanentRedirect("/");

  // KHÔNG đổi hero: bấm một pill category là lọc tại chỗ, hero phải đứng yên —
  // nếu tiêu đề hero nhảy theo thì trông đúng như vừa sang trang khác, ngược
  // hẳn với thứ khối này đang làm. Chỉ `<title>`/meta là theo category, và đó
  // là thứ Google đọc chứ người dùng không thấy nhảy.
  return <ResourcesPageBody activeCategory={slug} seo={category.seo} />;
}
