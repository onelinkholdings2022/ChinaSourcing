import { create } from "zustand";

// ─── Zustand store cho trạng thái UI của các listing ────────────────────────
//
// Ba listing của site (`.casestudy-list`, `.resource-listing`, `.blog-listing`)
// đều có bộ lọc + phân trang chạy hoàn toàn ở client. Khi trạng thái đó nằm
// trong `useState` của chính component, mọi lần điều hướng client-side đều
// dựng lại component và ném nó đi: lọc "Australia", vào một case study, bấm
// Back — bộ lọc về rỗng và người dùng phải chọn lại từ đầu.
//
// Store nằm NGOÀI cây React nên sống qua các lần điều hướng đó, mà vẫn mất khi
// F5 (đúng như site gốc: lọc là trạng thái của phiên xem, không phải URL).
// Chỉ giữ trạng thái UI — dữ liệu vẫn đến từ Strapi qua cache theo tag.
//
// Trạng thái được khoá theo `id` để nhiều listing trên cùng một trang
// (`/resources` có cả resource lẫn blog) không giẫm lên nhau.

/** Bộ lọc của `.casestudy-list` — cả ba đều là giá trị của `<select>`. */
export interface CaseStudyFilters {
  industry: string;
  region: string;
  service: string;
}

export const EMPTY_CASE_STUDY_FILTERS: CaseStudyFilters = { industry: "", region: "", service: "" };

interface ListingState {
  /** `<select>` đang chọn gì — CHƯA áp dụng cho tới khi bấm Search. */
  draft: Record<string, CaseStudyFilters>;
  /** Bộ lọc đang thực sự áp lên lưới. */
  applied: Record<string, CaseStudyFilters>;
  /** Tab đang chọn của listing dạng tab (`all` | slug category | loại resource). */
  tab: Record<string, string>;
  /** Trang hiện tại, dùng chung cho cả ba loại listing. */
  page: Record<string, number>;

  setDraft: (id: string, filters: CaseStudyFilters) => void;
  /** Áp `draft` lên lưới và quay về trang 1 — đúng hành vi nút Search. */
  applyDraft: (id: string) => void;
  /** Xoá cả `draft` lẫn `applied`, quay về trang 1 — nút Reset filters. */
  resetFilters: (id: string) => void;
  /** Đổi tab luôn kéo về trang 1, giống `selectType` của theme. */
  setTab: (id: string, tab: string) => void;
  setPage: (id: string, page: number) => void;
}

export const useListingStore = create<ListingState>((set) => ({
  draft: {},
  applied: {},
  tab: {},
  page: {},

  setDraft: (id, filters) => set((s) => ({ draft: { ...s.draft, [id]: filters } })),

  applyDraft: (id) =>
    set((s) => ({
      applied: { ...s.applied, [id]: s.draft[id] ?? EMPTY_CASE_STUDY_FILTERS },
      page: { ...s.page, [id]: 1 },
    })),

  resetFilters: (id) =>
    set((s) => ({
      draft: { ...s.draft, [id]: EMPTY_CASE_STUDY_FILTERS },
      applied: { ...s.applied, [id]: EMPTY_CASE_STUDY_FILTERS },
      page: { ...s.page, [id]: 1 },
    })),

  setTab: (id, tab) => set((s) => ({ tab: { ...s.tab, [id]: tab }, page: { ...s.page, [id]: 1 } })),

  setPage: (id, page) => set((s) => ({ page: { ...s.page, [id]: page } })),
}));

// ── Selector: đọc từng lát nhỏ để component chỉ re-render khi lát đó đổi ────

export const useListingTab = (id: string) => useListingStore((s) => s.tab[id] ?? "all");

export const useListingPage = (id: string) => useListingStore((s) => s.page[id] ?? 1);

export const useCaseStudyDraft = (id: string) =>
  useListingStore((s) => s.draft[id] ?? EMPTY_CASE_STUDY_FILTERS);

export const useCaseStudyApplied = (id: string) =>
  useListingStore((s) => s.applied[id] ?? EMPTY_CASE_STUDY_FILTERS);
