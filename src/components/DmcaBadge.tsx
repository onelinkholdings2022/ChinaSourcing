const DMCA_ID = "019ab15c-b0dc-4e7e-801a-d7eb4f26c1ac";

/**
 * Badge DMCA ở thanh dưới cùng footer — port từ `DmcaBadge` của OlcoMain.
 *
 * `<img>` thường chứ không phải `next/image`: DMCABadgeHelper sửa trực tiếp thẻ
 * `a.dmca-badge` (gắn `?refurl=<trang>` vào href), nên href đổi trước khi React
 * hydrate → cần `suppressHydrationWarning`. Script helper nằm trong
 * `src/app/layout.tsx`.
 *
 * Hiển thị 180x36, nạp bản w250 để
 * không vỡ hạt trên màn hình retina.
 */
export function DmcaBadge() {
  return (
    <a
      href={`//www.dmca.com/Protection/Status.aspx?ID=${DMCA_ID}`}
      title="DMCA.com Protection Status"
      className="dmca-badge inline-block"
      suppressHydrationWarning
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`https://images.dmca.com/Badges/dmca-badge-w250-5x1-08.png?ID=${DMCA_ID}`}
        alt="DMCA.com Protection Status"
        width={180}
        height={36}
        loading="lazy"
      />
    </a>
  );
}
