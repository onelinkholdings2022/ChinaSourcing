"use client";

import { useEffect, useState } from "react";

/**
 * `true` khi media query khớp. Luôn trả `false` ở lần render đầu (server và
 * hydrate) rồi mới cập nhật trong `useEffect` — đọc `matchMedia` khi render là
 * hydration mismatch, vì server không có viewport nào để đo.
 *
 * Dùng nó khi cần KHÔNG DỰNG một phần tử ở màn nhỏ. Ẩn bằng `hidden lg:block`
 * chỉ giấu về mặt hình ảnh: iframe/video bên trong vẫn tải và vẫn chạy.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(query);
    const sync = () => setMatches(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, [query]);

  return matches;
}
