import { Fragment } from "react";
import type { TextBlockViewData } from "@/lib/views/legalView";

/**
 * `.text-block` — khuôn trang pháp lý của theme (`/privacy-policy`).
 *
 * Bố cục hẹp: `.container` với `max-w-[800px]`, tiêu đề và đoạn dẫn canh giữa,
 * phần còn lại canh trái. Thân bài dùng `.rich-text` — cùng lớp mà bài case
 * study dùng — nên bảng cỡ chữ theo breakpoint đã có sẵn trong `globals.css`.
 */
export function TextBlock({ data }: { data: TextBlockViewData }) {
  return (
    <section className="text-block container max-w-[800px] mx-auto py-12 px-4 text-black relative">
      <h1 className="font-medium text-center mb-4 heading-1">{data.title}</h1>
      {data.intro && (
        <p className="text-center body-1 text-grey-600 mb-4 md:mb-6 lg:mb-8 xl:mb-[80px]">
          {data.intro}
        </p>
      )}
      {data.sections.map((section, i) => (
        // Site gốc lặp lại nguyên văn một heading ("How do we use your
        // information?" xuất hiện hai lần), nên key phải kèm chỉ số.
        <Fragment key={`${section.heading}-${i}`}>
          <h3 className="font-semibold text-cyan-950 mb-6 mt-10 heading-2">
            {section.heading}
          </h3>
          <div
            className="body-2 text-grey-600 leading-relaxed mb-6 max-w-full rich-text"
            dangerouslySetInnerHTML={{ __html: section.body }}
          />
        </Fragment>
      ))}
    </section>
  );
}
