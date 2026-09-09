# Ảnh trên cms.chinasourcing.co đang 404 — cách sửa

## Triệu chứng

Media Library ở `https://cms.chinasourcing.co/admin/plugins/upload` hiện icon
ảnh vỡ cho **toàn bộ** asset, và trang public cũng không có ảnh nào.

## Nguyên nhân

Không phải sai cấu hình Strapi, cũng không phải CSP của admin.

```
$ curl -i https://cms.chinasourcing.co/uploads/Icon_2bbe99b6cb.webp
HTTP/1.1 404 Not Found
Server: nginx/1.24.0 (Ubuntu)      ← nginx trả, KHÔNG phải Strapi
```

So sánh với một đường dẫn khác:

```
$ curl https://cms.chinasourcing.co/api/nonexistent
{"data":null,"error":{"status":404,...}}   ← Strapi trả (JSON)
```

Tức nginx có một `location /uploads` riêng, phục vụ file thẳng từ đĩa thay vì
proxy về Strapi — và thư mục nó trỏ tới **không có file nào**.

Lý do các file không có ở đó: `strapi-cns` dùng **local upload provider**, file
nằm trong `public/uploads` của tiến trình Strapi. Còn `DATABASE_CLIENT=mysql`
trỏ vào **TiDB Cloud dùng chung**, nên Strapi ở máy dev và Strapi trên server
đọc **cùng một database**. Bản ghi media (đường dẫn, kích thước, hash) có đủ ở
cả hai nơi; **file thật thì chỉ có trên máy dev**.

Hiện máy dev có 2285 file, 93 MB trong
`~/CodeProject/strapi-cns/public/uploads`.

## Cách sửa (chọn một)

### A. Đồng bộ file lên server — nhanh nhất, giữ nguyên kiến trúc

Từ máy dev:

```bash
# <user> và <đường dẫn Strapi trên server> thay bằng giá trị thật
rsync -avz --progress \
  ~/CodeProject/strapi-cns/public/uploads/ \
  <user>@103.221.223.148:<đường dẫn Strapi>/public/uploads/
```

Rồi trên server:

```bash
sudo chown -R <user Strapi chạy bằng>:<group> <đường dẫn Strapi>/public/uploads
# Kiểm tra nginx đang trỏ /uploads vào đâu:
sudo nginx -T | grep -A5 'location /uploads'
```

Nếu `root`/`alias` trong block đó **không** trỏ tới
`<đường dẫn Strapi>/public`, sửa lại cho đúng rồi `sudo nginx -t && sudo
systemctl reload nginx`.

Sau đó lệnh này phải trả `200`:

```bash
curl -o /dev/null -w '%{http_code}\n' \
  https://cms.chinasourcing.co/uploads/Icon_2bbe99b6cb.webp
```

⚠️ Sau bước này, MỌI lần upload ảnh mới **từ máy dev** cũng phải rsync lại — vì
DB dùng chung mà file thì không. Đây là lý do nên cân nhắc phương án B.

### B. Chuyển sang cloud storage provider — hết hẳn vấn đề

Cài `@strapi/provider-upload-cloudinary` (hoặc S3/R2) trong `strapi-cns`, khai
trong `config/plugins.ts`, rồi upload lại toàn bộ media. Sau đó `media.url` là
URL tuyệt đối của CDN, không còn phụ thuộc đĩa của server nào cả — dev và
production dùng chung DB thì cũng dùng chung ảnh, đúng như đang dùng chung nội
dung.

Nhớ thêm hostname của CDN vào `images.remotePatterns` trong
`chinasourcing-clone/next.config.ts`.

## Cho tới khi sửa xong

`chinasourcing-clone/.env.local` đã trỏ `NEXT_PUBLIC_STRAPI_URL` sang
`https://cms.chinasourcing.co` (nội dung đọc đúng, đã kiểm tra). Muốn xem có
ảnh ngay tại máy trong lúc chờ, đổi tạm về `http://localhost:1337` và chạy
`npm run develop` trong `strapi-cns` — cả hai host đều đã có trong
`images.remotePatterns`.

---

# Việc thứ hai cần làm trên server: deploy lại `strapi-cns`

Không liên quan tới ảnh, nhưng cùng cần quyền SSH.

`src/utils/deep-populate.ts` và 24 controller trong `src/api/*/controllers/`
vừa đổi: trước đây controller **ghi đè** `populate` của client vô điều kiện, nên
`/api/blog-posts` luôn trả kèm nguyên văn `content` của 131 bài — và vì
`categories` được populate ngược thành `category.blogPosts`, mỗi bài còn kéo
theo content của mọi bài cùng category.

Đo trên máy dev:

```
cũ (deep populate ép buộc) : 20 791 454 bytes
mới (client tự khai fields): 251 447 bytes      ← 82 lần nhỏ hơn
```

Chuyện này ăn thẳng vào yêu cầu "F5 không nạp lại cả site": Next có trần **2 MB
cho một entry cache**, nên response 18–20 MB kia **không bao giờ vào được
cache** —

```
Failed to set Next.js data cache for .../api/blog-posts?...,
items over 2MB can not be cached (28022803 bytes)
```

— và mỗi lần dựng trang lại tải lại từ đầu, thường timeout 15 s. Sau khi sửa,
`npm run build` sinh 188 trang tĩnh trong 2,7 giây, không còn cảnh báo nào.

Cùng lúc đó, `blog-post` có thêm field `readingTime` (đã backfill đủ 131 bài
bằng `scripts/fix-blogpost-reading-time.js`) để danh sách không cần `content`
chỉ để tính "N min read".

**Cho tới khi `strapi-cns` được deploy lại**, `cms.chinasourcing.co` vẫn chạy
controller cũ và vẫn trả 16 MB cho `/api/blog-posts` — nội dung đúng, nhưng
cache không hoạt động cho các trang có danh sách bài viết.
