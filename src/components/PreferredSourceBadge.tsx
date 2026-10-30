import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Google "Preferred sources": cho người đọc chọn chinasourcing.co làm nguồn ưu
 * tiên để bài lên nhiều hơn ở Top stories / AI Mode.
 * https://developers.google.com/search/docs/appearance/preferred-sources
 *
 * Port từ OlcoMain / VietNamSourcing: deep link + badge chính thức của Google
 * thay vì publisher.js (138KB). Dùng bản SÁNG (nền trắng, viền xám) vì cả footer
 * lẫn cột mục lục trang bài viết đều nền trắng.
 */
const PREFERRED_SOURCE_URL = "https://www.google.com/preferences/source?q=chinasourcing.co";

export function PreferredSourceBadge({ className }: { className?: string }) {
  return (
    <a
      href={PREFERRED_SOURCE_URL}
      target="_blank"
      rel="noopener"
      className={cn("inline-block w-fit transition-opacity duration-300 hover:opacity-85", className)}
    >
      <Image
        src="/images/google-preferred-source/google_preferred_source_badge_light_en@2x.png"
        alt="Add China Sourcing as a preferred source on Google"
        width={338}
        height={107}
        loading="lazy"
        className="h-auto w-[168px]"
      />
    </a>
  );
}
