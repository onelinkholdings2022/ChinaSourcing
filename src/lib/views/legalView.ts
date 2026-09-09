import { resolveContentMedia } from "./textUtils";
import type { PrivacyPolicyPageData } from "../types/privacy-policy-page";

export interface TextBlockSectionView {
  heading: string;
  /** HTML đã ghép `NEXT_PUBLIC_STRAPI_URL` vào mọi `src="/uploads/…"`. */
  body: string;
}

export interface TextBlockViewData {
  title: string;
  intro: string;
  sections: TextBlockSectionView[];
}

/**
 * `.text-block` — khuôn trang pháp lý của theme: một `<h1>`, một đoạn dẫn canh
 * giữa, rồi lặp `<h3>` + thân bài WYSIWYG. Đúng một khuôn cho mọi trang loại
 * này, nên view này nhận cả trang khác dùng chung component `legal.text-section`.
 */
export function buildTextBlockView(data: PrivacyPolicyPageData): TextBlockViewData {
  return {
    title: data.title ?? "",
    intro: data.intro ?? "",
    sections: (data.sections ?? [])
      // Section trống là do biên tập viên bấm "Add an entry" rồi bỏ dở — theme
      // không render `<h3>` rỗng, và một khối `.rich-text` rỗng vẫn ăn 24px.
      .filter((s) => (s.heading ?? "").trim() || (s.body ?? "").trim())
      .map((s) => ({
        heading: s.heading ?? "",
        body: resolveContentMedia(s.body),
      })),
  };
}
