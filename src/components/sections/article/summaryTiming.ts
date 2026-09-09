// Nhịp + phép đo của màn tóm tắt đầu bài (xem ArticleSummary.tsx). Bản port từ
// OlcoMain, giữ nguyên nhịp; chỉ `RING_RADIUS` đổi cho khớp bo góc ở đây.
//
// Tách khỏi component vì đây là phần THUẦN: không state, không DOM ngoài hai
// hàm đo nhận sẵn phần tử — nên đọc và chỉnh nhịp mà không phải đọc cả cây JSX.

/**
 * Mọi mốc thời gian của màn dàn cảnh. TS giữ mấy con số này chứ không phải CSS
 * vì chúng phụ thuộc LƯỢNG CHỮ đo được lúc chạy; CSS chỉ nhận qua biến.
 */
export const SUMMARY_TIMING = {
  /** Hàng chữ bắt đầu mở cao — sớm hơn lúc gõ để không có khung rỗng chờ chữ. */
  textRevealMs: 270,
  /** Ký tự đầu tiên rơi xuống sau khi vành viền đã bật. */
  typeStartMs: 405,
  /** Thời gian mỗi ký tự — 9ms ≈ 110 ký tự/giây, nhịp gõ máy đọc ra được. */
  charStepMs: 9,
  /**
   * Nghỉ sau ký tự cuối trước khi cụm "… Show More" fade vào. 60ms ≈ 4 frame:
   * mắt đọc ra như nút đáp xuống cùng lúc chữ dừng.
   *
   * Không cho số âm để nút vào SỚM hơn chữ: dấu "…" chỉ mount khi gõ xong, nên
   * nút sẽ hiện trước rồi "…" mới nhảy vào sau — thành hai cú thay vì một.
   */
  ctaGapMs: 60,
  /** Vệt viền xuất phát trễ chừng này — truyền xuống CSS qua --sum-sweep-delay. */
  sweepDelayMs: 180,
  /** Vệt chạy dài hơn mốc chữ 20%: khép vòng lúc "… Show More" đang đáp xuống. */
  sweepStretch: 1.2,
};

/** Dùng khi chưa đo được (SSR, hoặc DOM không cho đo). */
export const FALLBACK_CTA_DELAY_MS = 2000;
export const FALLBACK_SWEEP_MS = 2400;

/** Một dòng chữ trong ô — `.body-3` của site là 14px/24px. */
const LINE_HEIGHT = 24;
/** Chiều cao trạng thái gập: đúng 2 dòng. */
export const COLLAPSED_MAX_HEIGHT = LINE_HEIGHT * 2;

/**
 * Có gập hay không: ĐO xem cả đoạn có tràn quá 2 dòng không, chứ không đếm ký
 * tự. Cùng một chuỗi tràn 2 dòng ở cột hẹp lại vừa khít trên màn rộng hơn —
 * đếm ký tự thì hoặc là mọc nút thừa, hoặc là cụt chữ mà không có nút để mở.
 *
 * Gọi ở PHA ĐO, lúc `<p>` còn đang dựng trọn đoạn và chưa bị `max-height` khoá:
 * `scrollHeight` khi đó chính là chiều cao thật của cả đoạn. Cộng 1px dung sai
 * cho phép làm tròn subpixel của line-height.
 */
export function overflowsTwoLines(text: HTMLElement): boolean {
  return text.scrollHeight > COLLAPSED_MAX_HEIGHT + 1;
}

/** Bán kính bo của hộp — phải khớp `rounded-lg` (8px). Chỉ để tính chu vi. */
const RING_RADIUS = 8;

/** Chỗ chừa ở cuối dòng 2 cho dấu "…" đứng sau chữ bị cắt. */
const ELLIPSIS_RESERVE_PX = 16;

/**
 * Bao nhiêu TỪ đầu đoạn còn lọt 2 dòng (đã chừa chỗ cho dấu "…" ở cuối).
 *
 * Phải đo chứ không dùng `line-clamp`: nhịp gõ chữ và điểm dừng của vệt viền
 * đều tính theo lượng chữ này — canh theo cả đoạn thì mọi thứ tới trễ mấy giây
 * sau khi 2 dòng đã đầy. Nút Show More không nằm trong phép đo vì nó đã xuống
 * hẳn một dòng riêng bên dưới (xem `ArticleSummary`).
 */
export function countVisibleWords(text: HTMLElement, reservePx = ELLIPSIS_RESERVE_PX): number {
  const spans = text.querySelectorAll<HTMLElement>(".sum-measure");
  if (spans.length === 0) return 0;

  const firstTop = spans[0].offsetTop;
  const limit = text.clientWidth - reservePx;
  let count = 0;
  for (const span of spans) {
    const line = span.offsetTop - firstTop;
    if (line < LINE_HEIGHT) {
      count += 1; // dòng 1: giữ trọn
    } else if (line < COLLAPSED_MAX_HEIGHT && span.offsetLeft + span.offsetWidth <= limit) {
      count += 1; // dòng 2: chỉ giữ từ không lấn chỗ của dấu "…"
    } else {
      break;
    }
  }
  return count;
}

/**
 * Chu vi hộp bo góc, tính bằng px — độ dài một vòng của vệt viền.
 *
 * `extraHeight` là phần hộp sẽ nở thêm khi hàng chữ mở ra: phải lấy chiều cao
 * CUỐI, vì lúc đo hộp còn gập và nó nở trong lúc vệt đang chạy — canh theo
 * chiều cao lúc đo thì vệt hụt ~8% chu vi, không khép được vòng.
 */
export function ringLapPx(box: DOMRect, extraHeight: number): number {
  const height = box.height + extraHeight;
  const straight =
    2 * Math.max(box.width - 2 * RING_RADIUS, 0) + 2 * Math.max(height - 2 * RING_RADIUS, 0);
  return straight + 2 * Math.PI * RING_RADIUS;
}
