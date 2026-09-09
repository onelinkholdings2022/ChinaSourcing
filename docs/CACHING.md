# Cache & revalidate

Mục tiêu: **F5 không nạp lại cả site**. Sửa một case study trong Strapi thì chỉ
những trang có case study đó dựng lại, phần còn lại phục vụ từ cache.

## Ba tầng

| Tầng | Ở đâu | Sống bao lâu |
| --- | --- | --- |
| Next fetch cache (theo tag) | `src/lib/api/strapi-client.ts` | `revalidate: 3600`, hoặc tới khi tag bị thổi |
| Next image cache (ảnh đã tối ưu) | `.next/cache/images` trên đĩa | `images.minimumCacheTTL` |
| Trạng thái UI của listing | `src/lib/stores/listingStore.ts` (zustand) | Sống qua điều hướng client, mất khi F5 |

## 1. Fetch cache theo tag

Mọi request tới Strapi đi qua `StrapiClient`, và mọi Repository đều gắn tag:

```ts
this.fetchList<CaseStudy>("/case-studies", {
  revalidate: 3600,
  tags: ["strapi", "case-study"],
})
```

`strapi-client.ts` gắn cache ở **mọi môi trường** (trước đây dev luôn
`no-store`, nên mỗi F5 nạp lại toàn bộ nội dung). Muốn tắt khi soạn nội dung:

```bash
STRAPI_CACHE_DISABLED=1 npm run dev
```

## 2. Webhook Strapi → `/api/revalidate`

`src/app/api/revalidate/route.ts` nhận webhook, tra `model` trong
`src/lib/cache/revalidateTags.ts` và gọi `revalidateTag(tag, "max")` cho **đúng
những tag bị ảnh hưởng**.

Ví dụ sửa một case study:

```
model=case-study, slug=byronglow
→ case-study, case-studies-page, homepage, about-page,
  products-page, services-page, case-study:byronglow
```

Bảy tag đó là bảy chỗ case study thật sự xuất hiện; 15 trang product, 4 trang
service, 141 bài viết… đều không bị đụng tới.

`profile="max"` cho ngữ nghĩa stale-while-revalidate: khách kế tiếp vẫn nhận
bản cũ ngay lập tức, bản mới nạp ở nền.

### Cấu hình phía Strapi

Settings → Webhooks → Create new webhook:

- **URL**: `https://chinasourcing.co/api/revalidate`
- **Headers**: `x-revalidate-secret: <REVALIDATE_SECRET trong .env.local>`
- **Events**: Entry `publish` / `unpublish` / `update` / `delete`, và Media
  `create` / `update` / `delete`

### Test tay

```bash
SECRET=$(grep REVALIDATE_SECRET .env.local | cut -d= -f2)
curl "http://localhost:3000/api/revalidate?secret=$SECRET&model=case-study&slug=byronglow"
curl "http://localhost:3000/api/revalidate?secret=$SECRET&tag=strapi"   # bust tất cả
```

Sai secret → `401`.

## 3. Cache ảnh

Webhook media của Strapi gửi `{ event: "media.update", media: {...} }` —
**không có `model`** — nên route soi cả `event`. Khi media đổi, route xoá
`.next/cache/images`, vì thay ảnh tại chỗ (giữ nguyên URL) mà không xoá thì Next
vẫn phục vụ bản tối ưu cũ tới hết `minimumCacheTTL`, và restart tiến trình cũng
không cứu được (cache nằm trên đĩa).

## Vì sao không dùng Redis

`OlcoMain` cũng không dùng — nó nói thẳng trong `src/lib/proxy/rateLimit.ts`:
mô hình một VPS thì cửa sổ trượt trong tiến trình là đủ, "không kéo thêm Redis
vào". Ở đây cache đọc đã do Next lo (tag + đĩa) nên Redis không thêm gì: nó sẽ
là tầng thứ tư lưu đúng thứ Next đã lưu, thêm một điểm hỏng và một dịch vụ phải
vận hành. Nếu sau này chạy nhiều instance và cần cache dùng chung, chỗ để cắm
là `cacheHandler` của Next, chứ không phải bọc thêm quanh `StrapiClient`.
