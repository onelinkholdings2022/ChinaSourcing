import { permanentRedirect } from "next/navigation";

/**
 * Lưới đỡ cuối cùng cho 404.
 *
 * Site này không có trang 404: mọi URL không khớp đều về trang chủ. Việc đó xảy
 * ra ở hai tầng, và tầng này là tầng thứ hai:
 *
 *   1. `src/proxy.ts` — bắt gần như toàn bộ. Một segment ở gốc không có trong
 *      bảng phân giải thì chuyển hướng ngay, chưa render gì cả (301 khi đã đọc
 *      được bảng, 307 khi đang mù — lý do ở `lib/proxy/routingTable.ts`).
 *   2. File này — cho những gì lọt qua: path nhiều segment mà proxy không nhận
 *      ra, hoặc một `notFound()` phát ra từ bên trong cây render.
 *
 * `permanentRedirect` phát 308 (bản giữ nguyên method của 301). Ở đây 308 là
 * đúng vì đã render tới mức này nghĩa là thật sự không có route nào khớp — khác
 * với nhánh "đang mù" của proxy.
 */
export default function NotFound() {
  permanentRedirect("/");
}
