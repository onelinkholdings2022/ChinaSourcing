import { networkInterfaces } from "node:os";
import type { NextConfig } from "next";

/**
 * IPv4 mạng LAN của máy đang chạy dev server (vd. 192.168.1.46).
 *
 * Next chặn mọi origin khác `localhost` gọi tới tài nguyên dev (HMR, chunk
 * `/_next/…`), nên người cùng wifi mở `http://<ip>:3000` sẽ thấy trang không
 * chạy. Đọc IP từ card mạng thay vì ghi cứng, để đổi wifi / router cấp IP khác
 * vẫn chạy. Chỉ có tác dụng ở `next dev`, production không đọc tới.
 */
function lanAddresses(): string[] {
  return Object.values(networkInterfaces())
    .flat()
    .filter((net) => net && net.family === "IPv4" && !net.internal)
    .map((net) => net!.address);
}

/**
 * Định tuyến nằm ở `src/proxy.ts`, không ở đây.
 *
 * Trước đây file này rewrite `/case-study/:slug` → `/case-studies/:slug` để giữ
 * nguyên URL số ít mà site gốc phát hành. Giờ mọi trang chi tiết đều ở URL
 * PHẲNG `/<slug>`, nên các dạng có tiền tố — cả số ít lẫn số nhiều — đều 301 về
 * đó. Việc ấy cần biết slug thuộc loại nào, tức cần đọc CMS, mà `rewrites()`
 * chạy lúc build và chỉ so khớp mẫu tĩnh — nên nó phải là proxy.
 */
const nextConfig: NextConfig = {
  allowedDevOrigins: lanAddresses(),
  images: {
    // Ảnh động đến từ Strapi Media Library. `cms.chinasourcing.co` là nguồn
    // thật; `localhost:1337` giữ lại để chạy Strapi tại máy khi cần soạn nội
    // dung (đổi NEXT_PUBLIC_STRAPI_URL là xong, không phải sửa config).
    remotePatterns: [
      { protocol: "https", hostname: "cms.chinasourcing.co" },
      { protocol: "http", hostname: "localhost", port: "1337" },
    ],
    // Strapi local chạy trên loopback — Next chặn mặc định vì lo SSRF. An toàn
    // vì host duy nhất được whitelist trên loopback là localhost:1337.
    dangerouslyAllowLocalIP: true,
  },
};

export default nextConfig;
