"use client";

import { useMemo } from "react";
import { Tag } from "@/components/ui/button";
import { TabRail, type ListingTab } from "@/components/sections/resources/TabRail";
import { ListingPager } from "@/components/sections/resources/ListingPager";
import { BlogCard, type BlogCardData } from "@/components/sections/resources/BlogCard";
import { useListingStore, useListingPage } from "@/lib/stores/listingStore";
import { useUrlFilter } from "@/hooks/useUrlFilter";

// Số trang sống trong `useListingStore`, không phải `useState`: mở một bài rồi
// bấm Back thì trang đang xem phải còn nguyên — với state cục bộ thì component
// dựng lại và nó về 1.
//
// Mỗi category một khoá riêng: trang 3 của "Manufacturing" không có nghĩa gì ở
// "Canton Fair". Khoá riêng vừa reset về 1 khi chuyển, vừa nhớ đúng trang cũ
// khi quay lại.
const listingId = (category: string) => `resources-blog:${category}`;

/**
 * `.blog-listing` — the grey band holding the whole archive.
 *
 * The original renders all 129 cards into the HTML and pages through them with
 * `display`, six at a time; the same set is in the bundle here and gets sliced.
 * Cards with an empty `data-types` belong to no category and only ever show
 * under "All", which falls out of `includes()` on an empty list.
 *
 * ## Category đổi URL nhưng KHÔNG rời trang
 *
 * Mỗi category có URL riêng (`/<category-slug>`) và gõ thẳng vào thanh địa chỉ
 * thì server render đúng category đó. Nhưng bấm một pill thì **không** phải một
 * lượt điều hướng: bộ lọc chạy tại chỗ và URL được thay bằng
 * `history.pushState`. Không fetch lại, không render lại từ server, không rèm
 * chuyển trang, hero không đổi — trang vẫn là trang đang xem, chỉ khác cái đang
 * chọn và cái ghi trên thanh địa chỉ.
 *
 * Vì thế `activeCategory` từ server chỉ là **giá trị khởi tạo**; sau đó state
 * cục bộ nắm quyền. `popstate` đồng bộ ngược lại để Back/Forward vẫn đúng — đây
 * là lượt điều hướng duy nhất mà pushState tạo ra, và nó không tải lại gì cả.
 */
export function BlogListing({
  tag,
  heading,
  intro,
  tabs,
  cards,
  perPage,
  activeCategory = "all",
}: {
  tag: string;
  heading: string;
  intro: string;
  tabs: ListingTab[];
  cards: BlogCardData[];
  perPage: number;
  /** Slug category server render — chỉ là giá trị khởi tạo, xem chú thích trên. */
  activeCategory?: string;
}) {
  // Rail category: mỗi mục có URL riêng `/<slug>`, bấm thì lọc tại chỗ và URL
  // đổi theo. Toàn bộ luật (kể cả chuyện `/resources` có HAI rail dùng chung
  // một segment đường dẫn) nằm trong `useUrlFilter`.
  const values = useMemo(() => tabs.map((t) => t.value), [tabs]);
  const [type, select] = useUrlFilter({ initial: activeCategory, values });
  const id = listingId(type);
  const page = useListingPage(id);
  const setPage = useListingStore((s) => s.setPage);

  const matches = useMemo(
    () =>
      type === "all"
        ? cards
        : cards.filter((c) => (c.types ?? []).includes(type)),
    [cards, type],
  );

  const totalPages = Math.max(1, Math.ceil(matches.length / perPage));
  const current = Math.min(page, totalPages);
  const visible = matches.slice((current - 1) * perPage, current * perPage);

  return (
    <section className="blog-listing spacing bg-grey-50">
      <div className="container">
        <div className="mx-auto md:w-5/6 max-w-[900px]">
          <Tag className="mx-auto">{tag}</Tag>
          <h2 className="heading-2 font-semibold text-cyan-400 text-center mt-3">
            {heading}
          </h2>
          <p className="text-grey-600 body-2 font-medium mt-3 text-center max-w-[800px] mx-auto">
            {intro}
          </p>
        </div>

        <TabRail tabs={tabs} active={type} buttonClass="blog-tab-btn" onSelect={select} />

        <div className="mt-10 flex flex-wrap gap-6 md:gap-10 justify-center">
          {visible.map((card) => (
            <BlogCard key={card.href} card={card} />
          ))}
        </div>

        <ListingPager
          page={current}
          totalPages={totalPages}
          onChange={(n) => setPage(id, n)}
          variant="blog"
        />
      </div>
    </section>
  );
}
