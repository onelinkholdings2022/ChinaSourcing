"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

/**
 * Một rail lọc mà mỗi lựa chọn có URL riêng ở gốc site — nhưng bấm vào KHÔNG
 * rời trang.
 *
 * Dùng chung cho ba rail: category blog (`.blog-listing`), loại download
 * (`.resource-listing`) và ngành nhà máy (`Partners`). Cả ba cùng một hợp đồng:
 * gõ thẳng `/<slug>` thì server render đúng lựa chọn đó, còn bấm một pill thì
 * bộ lọc chạy tại chỗ và URL được thay bằng `history.pushState` — không fetch
 * lại, không render lại từ server, không rèm chuyển trang, hero đứng yên.
 *
 * Vì thế `initial` (giá trị server render) chỉ là giá trị KHỞI TẠO; sau đó
 * state cục bộ nắm quyền, và `popstate` đồng bộ ngược để Back/Forward vẫn khớp.
 *
 * ## Ba cái bẫy hook này giữ, và đều đã cắn thật
 *
 * 1. **Hai rail dùng chung một segment.** `/resources` có cả rail category lẫn
 *    rail loại download, mà đường dẫn chỉ có một chỗ. Bấm một category đẩy URL
 *    thành `/manufacturing`; rail kia cũng nghe `popstate` và cũng đọc segment
 *    đó, nên nếu nó nuốt luôn thì nó lọc theo một loại không tồn tại và lưới
 *    của nó trống trơn. `values` là chốt: chỉ nhận slug có trong rail của
 *    chính mình.
 *
 * 2. **Bấm lại pill đang mở.** Không đổi gì mà vẫn `pushState` thì trên trang
 *    chủ thanh địa chỉ nhảy từ `/` sang `/furniture-interior`, và Back sau đó
 *    là một nấc lịch sử rác.
 *
 * 3. **Pill "All" của rail này xoá bộ lọc của rail kia.** "All" trỏ về
 *    `/resources`. Đang ở `/manufacturing` (category blog) mà bấm "All" bên
 *    Free Resources thì URL về `/resources` trong khi lưới bài vẫn đang lọc —
 *    thanh địa chỉ nói dối. Nên "All" chỉ đẩy URL khi đường dẫn hiện tại đúng
 *    là của rail này.
 */
export function useUrlFilter({
  initial,
  values,
  resetValue = "all",
}: {
  /** Giá trị server render. */
  initial: string;
  /** Mọi giá trị rail này nhận — slug của chính nó, kể cả `resetValue`. */
  values: string[];
  /** Giá trị "không lọc gì". */
  resetValue?: string;
}): [string, (value: string, href?: string) => void] {
  const [value, setValue] = useState(initial);
  const owned = useMemo(() => new Set(values), [values]);

  // Server render một giá trị khác (điều hướng thật, vd bấm Back về `/resources`
  // rồi Forward) — bám theo prop.
  useEffect(() => {
    setValue(initial);
  }, [initial]);

  /** Segment đầu của đường dẫn hiện tại, nếu nó thuộc rail này. */
  const currentOwnedSegment = useCallback((): string | null => {
    const seg = window.location.pathname.split("/").filter(Boolean);
    if (seg.length !== 1) return null;
    return owned.has(seg[0]) ? seg[0] : null;
  }, [owned]);

  const select = useCallback(
    (next: string, href?: string) => {
      if (next === value) return; // bẫy 2
      setValue(next);
      if (!href) return;
      if (next === resetValue && !currentOwnedSegment()) return; // bẫy 3
      // `pushState` chứ không phải `router.push`: router.push chạy cả vòng
      // render của route đích, tức đúng cái "load lại trang" đang muốn tránh.
      // Đây chỉ đổi thanh địa chỉ, cây React giữ nguyên.
      window.history.pushState(null, "", href);
    },
    [value, resetValue, currentOwnedSegment],
  );

  // Back/Forward sau khi pushState: đọc lại lựa chọn từ chính URL.
  useEffect(() => {
    const sync = () => {
      // `?category=` là nhánh lùi của rail category khi slug đã bị một loại nội
      // dung ưu tiên cao hơn chiếm — xem `categoryHref`.
      const query = new URL(window.location.href).searchParams.get("category");
      const next = query ?? currentOwnedSegment() ?? resetValue; // bẫy 1
      setValue(owned.has(next) ? next : resetValue);
    };
    window.addEventListener("popstate", sync);
    return () => window.removeEventListener("popstate", sync);
  }, [owned, resetValue, currentOwnedSegment]);

  return [value, select];
}
