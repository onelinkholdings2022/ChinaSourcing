import type { NextConfig } from "next";

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
