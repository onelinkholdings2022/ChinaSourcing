import type { Metadata } from "next";
import { ProductsPageBody } from "@/components/ProductsPage";
import { productsPageController } from "@/lib";
import { buildPageMetadata } from "@/lib/views/globalView";
import { getMediaUrl } from "@/lib/api/media-url";

export async function generateMetadata(): Promise<Metadata> {
  const { data: page } = await productsPageController.getPage();
  const hero = page?.hero;
  return buildPageMetadata(page?.seo, {
    // Hero của trang này chẻ tiêu đề làm hai nửa (`titlePrefix` là dòng TypeIt).
    title: [hero?.titlePrefix, hero?.title].filter(Boolean).join(" ") || "Products",
    description: hero?.subtitle,
    image: getMediaUrl(hero?.image),
    path: "/products",
  });
}

/** `/products` — the category index. Thân trang ở `ProductsPageBody`. */
export default function Page() {
  return <ProductsPageBody />;
}
