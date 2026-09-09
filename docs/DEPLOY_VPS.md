# Deploy `chinasourcing-clone` lên VPS `103.110.87.227` + Cloudflare

> Doc này viết để **gõ theo từng dòng**. Mỗi lệnh ghi rõ chạy ở đâu:
> `[MÁY BẠN]` hay `[VPS]`.
>
> Phạm vi: **chỉ frontend Next.js**. `strapi-cns` **ở nguyên** VPS cũ
> `103.221.223.148` (`cms.chinasourcing.co`) — không đụng vào.
>
> Đích: bản clone **thay thế** site WordPress đang chạy ở `chinasourcing.co`,
> đứng sau Cloudflare, chứng chỉ Origin CA 15 năm, có rate limit và chặn truy
> cập thẳng vào IP.

---

## 0. Bức tranh trước / sau

| | Trước | Sau |
| --- | --- | --- |
| `chinasourcing.co` | WordPress ở `172.104.48.195` | Next.js ở `103.110.87.227`, qua Cloudflare |
| DNS | GoDaddy (`ns37/ns38.domaincontrol.com`) | Cloudflare nameserver |
| SSL | của máy WordPress | **Cloudflare Origin CA 15 năm** ở origin + cert của CF ở biên |
| IP gốc | ai cũng thấy | 🟠 giấu sau CF + firewall chỉ mở cho dải IP của CF |
| `cms.chinasourcing.co` | `103.221.223.148` | **giữ nguyên**, để ⚪️ DNS only |

### 8 sự thật quyết định toàn bộ kế hoạch

1. **🔴 Chứng chỉ Origin CA 15 năm KHÔNG được trình duyệt tin.** Nó chỉ có giá
   trị giữa Cloudflare và máy chủ của bạn. Nghĩa là: **bản ghi DNS của site phải
   luôn ở trạng thái 🟠 Proxied, vĩnh viễn.** Chuyển sang ⚪️ DNS only một phút
   thôi là mọi khách nhận `NET::ERR_CERT_AUTHORITY_INVALID`. Đây là cái giá của
   "SSL 15 năm" và nó không thương lượng được — không có CA công cộng nào cấp
   chứng chỉ quá 398 ngày.

2. **🔴 61 bài viết đang trỏ ảnh tuyệt đối về `chinasourcing.co/wp-content/…`**
   Nội dung được cào từ WordPress và giữ nguyên URL (TARGET.md deviation 25).
   Giây phút tên miền trỏ sang Next, `/wp-content/*` không còn ai phục vụ →
   **1070 ảnh trong thân bài hỏng, mà trang vẫn trả 200** nên không có cảnh báo
   nào. Đã có script xử lý — §1.3. **Phải chạy TRƯỚC khi đổi DNS**, vì sau đó
   nguồn ảnh biến mất.

3. **🔴 Đổi nameserver sang Cloudflare là chuyển TOÀN BỘ DNS, không riêng web.**
   `chinasourcing.co` đang chạy email Microsoft 365. Thiếu một bản ghi MX/DKIM
   là **chết email cả công ty**. Bảng đầy đủ ở §6.2 — soát từng dòng.

4. **Repo chưa có git remote, và đang có ~159 file chưa commit.** `git remote -v`
   không trả về gì. Không thể `git pull` trên VPS cho tới khi xử lý — §1.1.

5. **Máy đích đã có 2 project khác đang chạy.** Không được đoán cổng. §2.2 là
   bước dò, và nó phải chạy **trước** khi đặt bất cứ `PORT=` nào.

6. **Site chạy ISR theo tag, và project này KHÔNG có module purge Cloudflare.**
   (`OlcoMain` có `src/lib/cache/cloudflare.ts`; bản này không.) Nên **không được
   bật cache HTML ở biên** — publish bên CMS sẽ không đẩy được bản mới ra.
   Cache rule ở §6.6 cố ý chỉ cache asset tĩnh.

7. **Dùng Origin CA thì không cần certbot** — và đó chính là thứ cho phép khoá
   firewall chỉ cho dải IP của Cloudflare (§9.4). Nếu dùng Let's Encrypt thì
   phải chừa cổng 80 cho thử thách HTTP-01, tức không khoá được kín.

8. **`src/proxy.ts` gọi `/api/route-slugs` ở MỌI request.** Không đặt
   `INTERNAL_BASE_URL` thì mỗi lượt render đi vòng ra Cloudflare rồi quay lại
   máy — thêm một chặng mạng cho từng request. §4.3.

---

## 1. `[MÁY BẠN]` Chuẩn bị mã nguồn

### 1.1 Đưa code lên được VPS — chọn một trong hai

Repo hiện **không có remote**:

```bash
# [MÁY BẠN]
cd ~/CodeProject/chinasourcing-clone
git remote -v          # không ra gì
git status --short | wc -l   # ~159 file chưa commit
```

**Cách A — GitHub (khuyến nghị, giống các project khác).**

```bash
# [MÁY BẠN]
git add -A
git commit -m "Privacy policy page, responsive parity pass, deploy docs"

# Tạo repo trống trên GitHub trước (private), rồi:
git remote add origin git@github.com:onelinkholdings2022/chinasourcing-clone.git
git push -u origin master
```

**Cách B — rsync thẳng, không cần GitHub.** Dùng khi chưa muốn tạo repo. Bất
lợi: VPS không có lịch sử git, lần deploy sau phải rsync lại.

```bash
# [MÁY BẠN] — chạy SAU khi đã build thử ở §1.2
rsync -avz --delete \
  --exclude '.next' --exclude 'node_modules' --exclude '.git' \
  --exclude 'public/wp-content' \
  ~/CodeProject/chinasourcing-clone/ \
  onelink@103.110.87.227:/var/www/chinasourcing-clone/
```

> `public/wp-content` bị loại ở đây **có chủ ý** — 347 MB, đồng bộ riêng ở §4.4
> và chỉ cần làm lại khi có bài mới.

### 1.2 Ba cửa kiểm tra ở máy mình

```bash
# [MÁY BẠN]
npx tsc --noEmit     # phải im lặng
npm run lint         # 0 error (2 warning ở cqrs/bus.ts là cũ, chấp nhận)
npm run build        # phải xanh
```

Cả ba phải qua **trước** khi đụng tới VPS. Build hỏng trên máy chủ thì bạn đang
gỡ lỗi trên một cái máy không có editor.

### 1.3 🔴 Nhân bản kho ảnh WordPress — BẮT BUỘC, và phải làm TRƯỚC cutover

```bash
# [MÁY BẠN]
node scripts/mirror-wp-assets.mjs
```

Script đọc thân bài của `blog-posts` + `resources` bên CMS, gom mọi URL
`chinasourcing.co/wp-content/…` (cả `src` lẫn `srcset`), tải về
`public/wp-content/…`. Next phục vụ nguyên `public/` ở gốc URL nên
`/wp-content/uploads/…` sống lại — **không phải sửa nginx, không phải sửa nội
dung bên CMS.**

Số liệu lần chạy ngày 09/09/2026:

```
blog-posts: 132 bản ghi, resources: 12 bản ghi
1074 file  •  tải mới 1070  •  lỗi 4  •  347 MB
```

4 file lỗi là **404 ngay trên site gốc** — ảnh hỏng sẵn từ trước, không phải do
script:

```
/wp-content/uploads/2025/03/furniture-sourcing-agent-china-at-best-price-2-1024x683.jpg
/wp-content/uploads/2025/03/furniture-sourcing-agent-china-at-best-price-6-1024x683.webp
/wp-content/uploads/2025/03/sourcing-hub-in-china-is-best-for-business-1-1024x565.jpg
/wp-content/uploads/2025/03/sourcing-manufacturers-in-china-ultimate-guide-6-1024x683.webp
```

Kiểm lại bất cứ lúc nào mà không tải gì:

```bash
node scripts/mirror-wp-assets.mjs --check
```

Thư mục này **không vào git** (đã thêm `.gitignore`) — nó là bản sao kho ảnh của
site gốc, không phải mã nguồn.

> 💡 **Việc nên làm sau này, không phải bây giờ:** đẩy 1070 ảnh đó vào Strapi
> Media Library và sửa `src` trong nội dung, để site hết phụ thuộc vào một
> đường dẫn thừa kế từ WordPress. Trước mắt bản nhân bản này là cách rẻ nhất để
> cutover không làm hỏng bài viết nào.

---

## 2. `[VPS]` Khảo sát — làm TRƯỚC KHI đụng bất cứ thứ gì

```bash
ssh onelink@103.110.87.227     # hoặc root@, tuỳ máy được cấp thế nào
```

### 2.1 Máy này là gì

```bash
cat /etc/os-release | head -2      # Ubuntu hay AlmaLinux → quyết định apt/dnf, ufw/firewalld
free -h                            # RAM — dưới 4 GB thì cần swap (§3.3)
df -h /                            # cần ≥ 3 GB trống: node_modules + .next + 347 MB ảnh
node -v 2>/dev/null || echo "chưa có node"
nginx -v 2>&1 || echo "chưa có nginx"
pm2 -v 2>/dev/null || echo "chưa có pm2"
```

Next 16.2.1 cần **Node ≥ 20.9**. Máy dev đang chạy v24.18.0.

### 2.2 🔴 Dò cổng đã bị chiếm — làm trước khi đặt bất cứ `PORT=` nào

Bốn nguồn sự thật, phải xem **cả bốn** (một app có thể đang tắt tạm nhưng nginx
vẫn giữ chỗ cho nó):

```bash
# a) Cổng đang thực sự có tiến trình lắng nghe
sudo ss -ltnp

# Gọn hơn: chỉ cột cổng + tên tiến trình
sudo ss -ltnp | awk 'NR>1 {split($4,a,":"); print a[length(a)], $NF}' | sort -u

# b) pm2 đang quản gì (2 project kia gần như chắc chắn nằm đây)
pm2 list
pm2 jlist | python3 -c "import sys,json;[print(p['name'], p['pm2_env'].get('PORT','?'), p['pm2_env'].get('pm_cwd')) for p in json.load(sys.stdin)]"

# c) nginx đang chuyển tiếp đi những cổng nào — kể cả app đang tắt
sudo nginx -T 2>/dev/null | grep -nE "proxy_pass|server_name|listen" | grep -v "^\s*#"

# d) docker (nếu có)
docker ps --format 'table {{.Names}}\t{{.Ports}}' 2>/dev/null || true
```

Rồi tìm một cổng trống trong dải 3000–3099:

```bash
for p in $(seq 3000 3099); do
  ss -ltn "sport = :$p" | grep -q LISTEN || { echo "TRỐNG: $p"; break; }
done
```

**Ghi lại kết quả vào đây trước khi đi tiếp:**

| Cổng | Ai giữ | Nguồn |
| --- | --- | --- |
| ? | project 1 | `ss` / `pm2` |
| ? | project 2 | `ss` / `pm2` |
| **?** | ⬅️ **`chinasourcing-fe`** (chọn ở bước trên) | |

> ⚠️ Cổng trống theo `ss` mà lại xuất hiện trong `nginx -T` thì **đừng lấy** —
> app của người khác đang tắt tạm, bật lại là hai bên tranh nhau.

Doc này viết `3000` làm ví dụ. **Thay bằng cổng bạn vừa chọn ở mọi chỗ.**

### 2.3 nginx đã có cấu hình Cloudflare chưa

Máy dùng chung nhiều site — rất có thể ai đó đã bật Cloudflare cho một tên miền
khác từ trước:

```bash
sudo grep -rn "real_ip_header\|set_real_ip_from" /etc/nginx/ | grep -v "\.bak"
sudo grep -rn "limit_req_zone\|limit_conn_zone" /etc/nginx/
```

Có kết quả → **đừng khai lại** `real_ip_header` (§9.1) hay trùng tên zone
(§9.2). `nginx -t` sẽ đỏ ngay:

```text
nginx: [emerg] "real_ip_header" directive is duplicate in ...
```

---

## 3. `[VPS]` Chuẩn bị môi trường

### 3.1 Node

```bash
node -v
# Chưa có, hoặc < 20.9 — Ubuntu:
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
# AlmaLinux:
curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo -E bash -
sudo dnf install -y nodejs
```

> ⚠️ Đã có Node và 2 project kia đang chạy bằng nó → **đừng nâng cấp**. Nâng bản
> Node dưới chân app đang sống là cách nhanh nhất để làm hỏng hai thứ không
> liên quan. Nếu bản hiện tại < 20.9, dùng `nvm` cài riêng cho user.

### 3.2 pm2

```bash
pm2 -v || sudo npm install -g pm2
```

### 3.3 Swap — nếu RAM < 4 GB

`next build` là bước ngốn RAM nhất. Thiếu swap thì kernel OOM-kill giữa chừng và
thông báo lỗi trông như lỗi TypeScript.

```bash
free -h
swapon --show                       # đã có thì bỏ qua cả mục này
sudo fallocate -l 4G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile && sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

---

## 4. `[VPS]` Đưa code + cấu hình lên máy

### 4.1 Thư mục

```bash
sudo mkdir -p /var/www/chinasourcing-clone
sudo chown -R $USER:$USER /var/www/chinasourcing-clone
```

### 4.2 Code

```bash
# Cách A (GitHub)
cd /var/www
git clone git@github.com:onelinkholdings2022/chinasourcing-clone.git
# Cách B: đã rsync ở §1.1
```

### 4.3 `.env.production`

```bash
cd /var/www/chinasourcing-clone
nano .env.production
```

```bash
# CMS vẫn ở VPS cũ — KHÔNG đổi.
NEXT_PUBLIC_STRAPI_URL=https://cms.chinasourcing.co

# Đọc lúc BUILD. Đổi giá trị này là phải build lại.
NEXT_PUBLIC_SITE_URL=https://chinasourcing.co

# Cho `src/proxy.ts` đọc bảng định tuyến qua loopback thay vì vòng ra
# Cloudflare ở MỌI request. Số cổng phải khớp §2.2.
INTERNAL_BASE_URL=http://127.0.0.1:3000

# Dùng chung với webhook Strapi (§10). Sinh bằng: openssl rand -base64 32
REVALIDATE_SECRET=<dán chuỗi vừa sinh>

# PDF cho nút "Download A Sourcing Guide" (hero trang chủ) và nút Download ở
# /resources. Thiếu biến này thì cả hai nút lùi về link /contact-us.
NEXT_PUBLIC_SOURCING_GUIDE_PATH=/uploads/intro_to_china_manufacturing_e9b336107a.pdf
```

```bash
chmod 600 .env.production
```

### 4.4 Kho ảnh WordPress (347 MB)

```bash
# [MÁY BẠN] — chạy sau §1.3
rsync -avz --progress \
  ~/CodeProject/chinasourcing-clone/public/wp-content/ \
  onelink@103.110.87.227:/var/www/chinasourcing-clone/public/wp-content/
```

```bash
# [VPS] xác nhận
find /var/www/chinasourcing-clone/public/wp-content -type f | wc -l   # ≈ 1070
du -sh /var/www/chinasourcing-clone/public/wp-content                 # ≈ 347M
```

---

## 5. `[VPS]` Build và chạy thử — chưa đụng DNS

### 5.1 Cài + build

```bash
cd /var/www/chinasourcing-clone
npm ci
npm run build
```

Build đọc `.env.production` cho các biến `NEXT_PUBLIC_*`. Log sẽ có vài dòng
`[StrapiClient] …` — bình thường, nó đang lấy nội dung để prerender.

### 5.2 Chạy bằng pm2

Cấu hình nằm sẵn trong repo ở `ecosystem.config.js`. **Sửa `PORT` trong đó cho
khớp cổng đã dò ở §2.2** (và khớp `INTERNAL_BASE_URL` ở §4.3), rồi:

```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup        # chạy dòng lệnh nó in ra, để pm2 tự lên sau khi reboot
pm2 logs chinasourcing-fe --lines 50
```

> Cổng đặt bằng biến `PORT` chứ không phải cờ `-p`: truyền `-p` qua
> `pm2 start npm -- start -- -p 3000` phải đi qua hai lớp bóc tham số và rất dễ
> rơi mất — app im lặng nghe ở 3000 mặc định trong khi nginx trỏ đi chỗ khác.

### 5.3 Kiểm ngay trên máy chủ

```bash
curl -I http://127.0.0.1:3000/                      # 200
curl -I http://127.0.0.1:3000/privacy-policy        # 200
curl -s http://127.0.0.1:3000/api/route-slugs | head -c 200   # JSON bảng slug
curl -I http://127.0.0.1:3000/wp-content/uploads/2025/02/China-sourcing-strategy-1024x765.jpeg
#   → 200 image/jpeg. 404 ở đây nghĩa là §4.4 chưa xong — DỪNG, đừng cutover.
```

### 5.4 Xem bằng mắt trước khi đổi DNS

```bash
# [MÁY BẠN]
ssh -L 8080:127.0.0.1:3000 onelink@103.110.87.227
# rồi mở http://localhost:8080
```

Soát: trang chủ, `/products`, `/resources`, **một bài blog có ảnh trong thân
bài**, `/privacy-policy`. Thu nhỏ cửa sổ xuống ~390px kiểm mobile.

---

## 6. Cloudflare

### 6.1 Thêm site

1. `dash.cloudflare.com` → **Add a site** → `chinasourcing.co` → gói **Free**.
2. CF quét DNS hiện có và dựng lại bảng. **Không tin tuyệt đối bản quét này.**
3. Song song, **xuất bản ghi từ GoDaddy** (`Domain → DNS → Export zone file`) và
   đối chiếu từng dòng với bảng §6.2. DNS không có lệnh "liệt kê tất cả", nên
   bản xuất của GoDaddy là nguồn sự thật duy nhất.

### 6.2 🔴 Bản ghi DNS — soát từng dòng trước khi đổi nameserver

Đây là ảnh chụp thực tế ngày 09/09/2026 (`dig @1.1.1.1`). **Mọi dòng không phải
web đều phải có mặt trong Cloudflare TRƯỚC khi đổi nameserver.**

| Tên | Loại | Giá trị | Proxy | Mất thì sao |
| --- | --- | --- | --- | --- |
| `chinasourcing.co` | A | **`103.110.87.227`** ⬅️ đổi | 🟠 Proxied | — |
| `www` | CNAME | `chinasourcing.co` | 🟠 Proxied | — |
| `cms` | A | `103.221.223.148` | ⚪️ **DNS only** | CMS chết |
| `chinasourcing.co` | MX | `chinasourcing-co.mail.protection.outlook.com` (prio 0) | — | 🔴 **chết email** |
| `chinasourcing.co` | TXT | `v=spf1 include:spf.protection.outlook.com include:46681098.spf07.hubspotemail.net -all` | — | mail vào spam |
| `chinasourcing.co` | TXT | `MS=ms12489872` | — | Microsoft bỏ xác thực tên miền |
| `_dmarc` | TXT | `v=DMARC1; p=quarantine` | — | mất chính sách DMARC |
| `autodiscover` | CNAME | `autodiscover.outlook.com` | ⚪️ DNS only | Outlook không tự cấu hình được |
| `selector1._domainkey` | CNAME | `selector1-chinasourcing-co._domainkey.netorgft6591838.a-v1.dkim.mail.microsoft` | ⚪️ DNS only | 🔴 DKIM hỏng → mail vào spam |
| `selector2._domainkey` | CNAME | `selector2-chinasourcing-co._domainkey.netorgft6591838.a-v1.dkim.mail.microsoft` | ⚪️ DNS only | như trên |

> ⚠️ **`cms` để ⚪️ DNS only.** Hai lý do: (a) Strapi admin upload ảnh, mà CF gói
> Free chặn body > 100 MB; (b) nó nằm ở máy khác, bật proxy cùng lúc với cutover
> làm bạn mất khả năng phân biệt lỗi ở đâu. Cái giá: IP `103.221.223.148` vẫn
> lộ. IP của **máy mới** thì không — không bản ghi nào trỏ tới nó mà không qua
> proxy.

> ⚠️ Bản ghi `_domainkey` là **CNAME**, không phải TXT. Cloudflare đôi khi quét
> nhầm thành TXT chứa giá trị đã phân giải. Sai kiểu là DKIM hỏng.

### 6.3 Chưa đổi nameserver vội

Làm xong §6.4 → §7 (cert + nginx) rồi mới đổi ở §8. Đổi nameserver là lúc khách
bắt đầu đi vào máy mới; máy phải sẵn sàng trước.

### 6.4 Chứng chỉ Origin CA 15 năm

**Cloudflare → SSL/TLS → Origin Server → Create Certificate.**

| Ô | Chọn |
| --- | --- |
| Private key type | **RSA (2048)** — tương thích rộng nhất |
| Hostnames | `chinasourcing.co`, `*.chinasourcing.co` |
| Certificate Validity | **15 years** |

Màn hình hiện **hai** khối văn bản. Khối *Private key* chỉ hiện **một lần** —
copy ngay, đóng trang là mất.

```bash
# [VPS]
sudo mkdir -p /etc/ssl/cloudflare
sudo nano /etc/ssl/cloudflare/chinasourcing.co.pem      # dán Origin Certificate
sudo nano /etc/ssl/cloudflare/chinasourcing.co.key      # dán Private Key
sudo chmod 600 /etc/ssl/cloudflare/chinasourcing.co.key
sudo chmod 644 /etc/ssl/cloudflare/chinasourcing.co.pem

# Kiểm: hạn phải là +15 năm, CN/SAN phải có cả apex lẫn wildcard
sudo openssl x509 -in /etc/ssl/cloudflare/chinasourcing.co.pem -noout -enddate -subject -ext subjectAltName
```

> 🔴 Nhắc lại sự thật số 1: chứng chỉ này **chỉ Cloudflare tin**. Bản ghi A phải
> ở 🟠 Proxied mãi mãi. Đặt nhắc lịch **tháng 9/2041** cho ngày hết hạn — 15 năm
> nữa sẽ không ai còn nhớ chuyện này.

### 6.5 SSL/TLS mode

**SSL/TLS → Overview → `Full (strict)`.**

| Chế độ | Chuyện gì xảy ra |
| --- | --- |
| `Off` / `Flexible` | 🚫 CF gọi origin bằng http, nginx redirect về https → **vòng lặp chuyển hướng vô tận**. Lỗi kinh điển khi mới bật CF. |
| `Full` | CF gọi https nhưng không kiểm chứng chỉ — chấp nhận cả cert giả |
| **`Full (strict)`** | ✅ Đúng cho máy này: origin có Origin CA thật do chính CF cấp |

Bật thêm:

- **Always Use HTTPS**: ON
- **Minimum TLS Version**: 1.2
- **Automatic HTTPS Rewrites**: ON
- **HSTS**: bật sau khi site chạy ổn định **một tuần**. Gỡ ra rất khó — trình
  duyệt ghim tới 2 năm.

### 6.6 Cache Rules

> 🔴 **Không cache HTML.** Project này không có module purge Cloudflare (sự thật
> số 6). Cache HTML ở biên thì publish bên CMS không đẩy được bản mới ra, và bạn
> sẽ ngồi tìm lỗi ở ISR trong khi lỗi nằm ở CDN.

**Rules → Cache Rules**, tạo theo thứ tự:

| # | Điều kiện | Hành động |
| --- | --- | --- |
| 1 | URI Path bắt đầu bằng `/api/` | **Bypass cache** |
| 2 | URI Path bắt đầu bằng `/_next/static/` | Eligible for cache, Edge TTL **1 năm**, Browser TTL 1 năm |
| 3 | URI Path bắt đầu bằng `/wp-content/` | Eligible for cache, Edge TTL **1 tháng** |
| 4 | URI Path bắt đầu bằng `/images/` | Eligible for cache, Edge TTL **1 tháng** |

`/_next/image` (ảnh Strapi đã tối ưu) cứ để CF xử lý mặc định — Next đã gửi
`Cache-Control` hợp lý cho nó.

### 6.7 Speed / Optimization

| Thiết lập | Đặt | Vì sao |
| --- | --- | --- |
| **Rocket Loader** | 🔴 **OFF — bắt buộc** | Nó dời/hoãn thực thi `<script>`, phá hydrate của React. Triệu chứng: trang hiện ra nhưng **không bấm được gì**, GSAP/Lenis chết |
| **Brotli** | ON | |
| **HTTP/3 (QUIC)** | ON | |
| **0-RTT** | ON | |
| **Polish / Mirage** | OFF | `next/image` đã xuất AVIF/WebP; thêm một tầng biến đổi nữa chỉ tốn công |
| **Email Obfuscation** | OFF | Chèn script vào HTML, dễ đá nhau với React |

---

## 7. `[VPS]` nginx

### 7.1 File cấu hình

```bash
# Ubuntu
sudo nano /etc/nginx/sites-available/chinasourcing.co
# AlmaLinux
sudo nano /etc/nginx/conf.d/chinasourcing.co.conf
```

```nginx
# Cổng 80: chỉ để chuyển hướng. Cloudflare luôn gọi origin bằng 443
# (Full strict), nên block này chủ yếu bắt người gõ thẳng IP.
server {
    listen 80;
    server_name chinasourcing.co www.chinasourcing.co;
    return 301 https://$host$request_uri;
}

# www → apex, 301. Site gốc cũng làm đúng vậy (đã đo: `curl -I
# https://www.chinasourcing.co` trả 301). Bỏ khối này thì cùng một trang phục vụ
# ở hai địa chỉ trong khi thẻ canonical chỉ trỏ về apex — Google gọi đó là nội
# dung trùng lặp, và nó là một thay đổi hành vi so với bản gốc chứ không phải
# chuyện nhỏ về thẩm mỹ URL.
server {
    listen 443 ssl;
    http2 on;
    server_name www.chinasourcing.co;

    ssl_certificate     /etc/ssl/cloudflare/chinasourcing.co.pem;
    ssl_certificate_key /etc/ssl/cloudflare/chinasourcing.co.key;

    # Cùng lá chắn như block apex bên dưới. Cần ở ĐÂY nữa vì đây là block 443
    # đầu tiên trong file: nếu máy chưa có `default_server`, mọi request với
    # Host lạ (gõ thẳng IP) rơi vào đúng block này.
    if ($host != "www.chinasourcing.co") { return 444; }

    return 301 https://chinasourcing.co$request_uri;
}

server {
    listen 443 ssl;
    # nginx >= 1.25.1. Bản cũ hơn báo `unknown directive "http2"` — khi đó bỏ
    # dòng này đi và viết `listen 443 ssl http2;` ở trên. Kiểm: `nginx -v`.
    http2 on;
    server_name chinasourcing.co;

    # Chứng chỉ Origin CA 15 năm — §6.4. KHÔNG phải Let's Encrypt,
    # KHÔNG chạy certbot cho tên miền này.
    ssl_certificate     /etc/ssl/cloudflare/chinasourcing.co.pem;
    ssl_certificate_key /etc/ssl/cloudflare/chinasourcing.co.key;
    ssl_protocols       TLSv1.2 TLSv1.3;

    # mTLS: chỉ nhận request có chứng chỉ client của Cloudflare — §9.5.
    # Để nguyên dạng chú thích cho tới khi làm xong §9.5.
    # ssl_client_certificate /etc/ssl/cloudflare/authenticated_origin_pull_ca.pem;
    # ssl_verify_client on;

    # Chặn ai đó gõ thẳng https://103.110.87.227 với Host giả. Nếu máy chưa có
    # `default_server`, nginx lấy block ĐẦU TIÊN làm mặc định — và block đó có
    # thể là block này. Dòng dưới đóng hẳn kết nối đó.
    #
    # Dùng $host chứ KHÔNG phải $http_host: $http_host giữ nguyên cổng client
    # gửi lên, nên "Host: chinasourcing.co:443" (hoàn toàn hợp lệ) sẽ không khớp
    # và khách thật ăn 444.
    if ($host != "chinasourcing.co") { return 444; }

    limit_conn cs_conn 20;

    # Body lớn chỉ cần cho webhook; mặc định giữ chặt.
    client_max_body_size 1m;

    location / {
        limit_req zone=cs_crawl burst=50 nodelay;

        proxy_pass http://127.0.0.1:3000;   # ⬅️ cổng đã chọn ở §2.2
        proxy_http_version 1.1;
        proxy_set_header Host              $host;
        proxy_set_header X-Real-IP         $remote_addr;
        proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Webhook Strapi: body có thể > 1 MB. Thiếu chỗ nới riêng này thì nginx trả
    # HTML 413, Strapi đọc phải rồi nổ "Unexpected token '<'", và cache KHÔNG
    # được xoá dù publish vẫn báo thành công.
    location = /api/revalidate {
        client_max_body_size 10m;
        limit_req zone=cs_crawl burst=50 nodelay;

        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host              $host;
        proxy_set_header X-Real-IP         $remote_addr;
        proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Ảnh tối ưu của Next — KHÔNG rate limit (một trang thật bắn rất nhiều request).
    location /_next/image {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host              $host;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Asset bất biến (có vân tay trong tên) — KHÔNG rate limit.
    location /_next/static/ {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    # Kho ảnh WordPress nhân bản (§1.3) — tĩnh, không rate limit.
    location /wp-content/ {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        add_header Cache-Control "public, max-age=2592000";
    }
}
```

> 🚨 **Ba `proxy_pass` phải cùng một cổng.** Bẫy có thật ở project anh em: một
> file mẫu ghi `3010` ở `location /` nhưng `3000` ở `/_next/image` — không có gì
> nghe ở 3000 → ảnh và JS/CSS trả **502** trong khi HTML vẫn 200: trang hiện ra
> nhưng trắng trơn, không ảnh, không hiệu ứng.

### 7.2 Bật + kiểm

```bash
# Ubuntu
sudo ln -s /etc/nginx/sites-available/chinasourcing.co /etc/nginx/sites-enabled/

sudo nginx -t          # ĐỎ thì KHÔNG reload — nginx đang chạy vẫn giữ config cũ
sudo systemctl reload nginx
```

Zone `cs_crawl` / `cs_conn` chưa khai → `nginx -t` sẽ báo lỗi. Làm §9.2 trước.

### 7.3 AlmaLinux: SELinux

Nếu nginx trả 502 trong khi `curl 127.0.0.1:3000` trên chính máy đó vẫn 200:

```bash
getenforce                                   # Enforcing?
sudo setsebool -P httpd_can_network_connect 1
sudo systemctl reload nginx
```

---

## 8. Cutover

### 8.1 Trước khi đổi — dừng lại và soát

- [ ] `§5.3` cả 4 lệnh `curl` đều xanh, kể cả ảnh `/wp-content/`
- [ ] `§5.4` đã xem bằng mắt qua SSH tunnel, cả desktop lẫn mobile
- [ ] `§6.2` đã đối chiếu với bản xuất zone của GoDaddy — **MX, SPF, DKIM, DMARC đủ**
- [ ] `§6.4` chứng chỉ đã cài, `openssl x509` báo đúng hạn 15 năm
- [ ] `§9` đã làm xong (đặc biệt **§9.1 real-IP** — thiếu là 429 cả site)
- [ ] `pm2 save` + `pm2 startup` đã chạy
- [ ] Đã ghi lại IP cũ **`172.104.48.195`** để rollback

### 8.2 Đổi nameserver

GoDaddy → `chinasourcing.co` → **Nameservers → Change → I'll use my own
nameservers** → dán 2 nameserver Cloudflare cấp.

Chờ CF chuyển sang **Active** (5 phút – vài giờ).

### 8.3 Kiểm sau khi Active

```bash
# [MÁY BẠN]
dig +short A chinasourcing.co @1.1.1.1        # phải ra IP của Cloudflare, KHÔNG phải 103.110.87.227
curl -sI https://chinasourcing.co | grep -i "^server\|^cf-\|^HTTP"
#   → server: cloudflare  +  cf-ray: …

dig +short MX chinasourcing.co @1.1.1.1       # vẫn phải là outlook
dig +short TXT _dmarc.chinasourcing.co @1.1.1.1

# Gửi thử một email tới hộp thư công ty và một email TỪ hộp thư đó ra ngoài.
```

### 8.4 Rollback

DNS đã ở Cloudflare rồi thì rollback **nhanh hơn** lúc chưa có: sửa bản ghi A về
`172.104.48.195` và để ⚪️ DNS only, TTL của CF là vài giây.

> ⚠️ Phải **bỏ proxy** khi rollback: máy WordPress cũ không có Origin CA của bạn,
> để 🟠 với `Full (strict)` là lỗi 526.

---

## 9. Bảo mật

### 9.1 🚨 Khôi phục IP thật — không làm là 429 cả site

Sau khi bật orange cloud, mọi request tới VPS đều đến **từ IP của Cloudflare**.
Mà `limit_req` đếm theo `$binary_remote_addr`. Hệ quả: cả thế giới bị gộp thành
vài chục IP → chạm trần trong tích tắc → **toàn bộ khách ăn 429**. Log truy cập
cũng ghi toàn IP của CF, vô dụng khi cần lần vết.

Kiểm đã có chưa (§2.3). **Chưa có** thì sinh file tự động từ danh sách sống của
Cloudflare — đừng chép tay, dải IP có thay đổi:

```bash
{
  echo "# Sinh tự động $(date -I) từ https://www.cloudflare.com/ips"
  echo "# Chạy lại file này mỗi 6 tháng."
  curl -s https://www.cloudflare.com/ips-v4 | sed 's/^/set_real_ip_from /; s/$/;/'
  curl -s https://www.cloudflare.com/ips-v6 | sed 's/^/set_real_ip_from /; s/$/;/'
  echo "real_ip_header CF-Connecting-IP;"
  echo "real_ip_recursive on;"
} | sudo tee /etc/nginx/conf.d/00-cloudflare-realip.conf
```

> Tên bắt đầu bằng `00-` để nạp trước các file site. `set_real_ip_from` khai bao
> nhiêu lần cũng được (cộng dồn), nhưng **`real_ip_header` chỉ được xuất hiện một
> lần** trong cùng ngữ cảnh — nên nếu §2.3 đã thấy có sẵn thì chỉ thêm các dòng
> `set_real_ip_from` vào file cũ, đừng tạo file mới.

Ubuntu: xác nhận `include` nằm **trong** block `http { }`:

```bash
grep -n "^http {\|include /etc/nginx/conf.d" /etc/nginx/nginx.conf
```

### 9.2 Rate limit ở nginx

Khai zone trong block `http { }` của `/etc/nginx/nginx.conf`, hoặc một file
riêng trong `conf.d/`:

```bash
sudo tee /etc/nginx/conf.d/01-ratelimit-chinasourcing.conf <<'EOF'
# Zone đặt tiền tố cs_ để không đụng tên zone của 2 project kia trên máy này.
limit_req_zone  $binary_remote_addr  zone=cs_crawl:10m  rate=30r/s;
limit_conn_zone $binary_remote_addr  zone=cs_conn:10m;
limit_req_status  429;
limit_conn_status 429;
EOF
sudo nginx -t && sudo systemctl reload nginx
```

30r/s nghe cao, nhưng **một trang thật bắn hàng chục request** (JS, CSS, font,
ảnh). Đây là lớp chặn kẻ quét, không phải chặn khách.

> Zone chỉ có tác dụng khi `limit_req` được gọi trong `location` — §7.1 đã gọi ở
> `/` và `/api/revalidate`, cố ý **không** gọi ở `/_next/*` và `/wp-content/`.

### 9.3 Rate limit + WAF ở Cloudflare

Chặn ở biên rẻ hơn nhiều: request bị chặn **không bao giờ chạm tới VPS**.

**Security → WAF → Managed rules**: bật **Cloudflare Free Managed Ruleset**.

**Security → WAF → Rate limiting rules** — gói Free cho **1 rule**, nên dùng nó
cho chỗ đáng giá nhất:

| Ô | Giá trị |
| --- | --- |
| Rule name | `protect-api` |
| If | `URI Path` starts with `/api/` |
| Rate | 20 requests / 10 seconds |
| Per | IP address |
| Action | **Block**, thời hạn 60 giây |

**Security → Bots**: bật **Bot Fight Mode**.

> ⚠️ Bot Fight Mode có thể chặn cả công cụ SEO hợp lệ (Ahrefs, Screaming Frog).
> Sau khi bật, chạy một lượt kiểm SEO; bị chặn thì tạo **WAF Custom Rule** cho
> user-agent đó `Skip → Bot Fight Mode`.

**Security → Settings**: `Security Level` = **Medium**.

**Chỉ khi đang bị tấn công thật**, bật `I'm Under Attack` — nó chèn màn hình
kiểm tra 5 giây cho **mọi** khách, đừng để bật thường trực.

### 9.4 🔒 Firewall: chỉ cho Cloudflare vào 80/443

Đây là thứ biến "giấu IP" thành "IP có lộ cũng vô dụng". Làm được **vì** ta dùng
Origin CA chứ không phải Let's Encrypt (sự thật số 7).

```bash
# ── Ubuntu (ufw) ─────────────────────────────────────────────────────────────
sudo ufw allow OpenSSH                 # ĐỪNG BỎ QUA — khoá xong mà mất SSH là hết đường
for ip in $(curl -s https://www.cloudflare.com/ips-v4) $(curl -s https://www.cloudflare.com/ips-v6); do
  sudo ufw allow proto tcp from $ip to any port 80,443 comment 'Cloudflare'
done
sudo ufw --force enable
sudo ufw status numbered
```

```bash
# ── AlmaLinux (firewalld) ────────────────────────────────────────────────────
sudo firewall-cmd --permanent --new-ipset=cloudflare --type=hash:net
for ip in $(curl -s https://www.cloudflare.com/ips-v4); do
  sudo firewall-cmd --permanent --ipset=cloudflare --add-entry=$ip
done
sudo firewall-cmd --permanent --add-rich-rule='rule source ipset=cloudflare service name=http accept'
sudo firewall-cmd --permanent --add-rich-rule='rule source ipset=cloudflare service name=https accept'
sudo firewall-cmd --permanent --remove-service=http
sudo firewall-cmd --permanent --remove-service=https
sudo firewall-cmd --reload
```

> ⚠️ Đoạn firewalld trên **chỉ nạp dải IPv4**. Máy có bản ghi AAAA thì Cloudflare
> sẽ gọi origin qua IPv6 và bị chặn sạch — khi đó phải tạo thêm một ipset
> `--type=hash:net --option=family=inet6` và nạp `ips-v6` vào đó. Không có AAAA
> thì bỏ qua. Kiểm: `ip -6 addr show scope global`.

> 🔴 **Máy này còn 2 project khác.** Nếu tên miền của chúng **chưa** ở sau
> Cloudflare, khoá 80/443 như trên là **giết luôn hai site đó**. Kiểm trước:
> ```bash
> sudo nginx -T | grep server_name        # liệt kê mọi tên miền trên máy
> for d in <từng tên miền>; do dig +short A $d | head -1; done
> #   IP của Cloudflare → an toàn. IP thật của VPS → ĐỪNG khoá.
> ```
> Chưa an toàn thì bỏ qua §9.4, làm §9.5 thay thế — nó chỉ ảnh hưởng
> `chinasourcing.co`.

Kiểm sau khi khoá:

```bash
# [MÁY BẠN] — phải TIMEOUT hoặc bị từ chối
curl -m 10 -I --resolve chinasourcing.co:443:103.110.87.227 https://chinasourcing.co
# [MÁY BẠN] — phải 200
curl -I https://chinasourcing.co
```

### 9.5 Authenticated Origin Pulls (mTLS)

Chỉ nhận request mang chứng chỉ client của Cloudflare. Bảo vệ ở tầng nginx nên
**không đụng tới 2 project kia** — an toàn hơn §9.4 khi máy dùng chung.

```bash
# [VPS]
sudo curl -o /etc/ssl/cloudflare/authenticated_origin_pull_ca.pem \
  https://developers.cloudflare.com/ssl/static/authenticated_origin_pull_ca.pem
```

Bỏ chú thích 2 dòng `ssl_client_certificate` / `ssl_verify_client` ở §7.1, rồi:

```bash
sudo nginx -t && sudo systemctl reload nginx
```

Cloudflare → **SSL/TLS → Origin Server → Authenticated Origin Pulls** → bật.

> ⚠️ Bật ở nginx mà quên bật ở Cloudflare = **toàn site 400**. Bật ở CF trước,
> nginx sau, và mở sẵn một tab `curl -I https://chinasourcing.co` để thấy ngay.

### 9.6 Cứng hoá phần còn lại

```bash
# fail2ban cho SSH
sudo apt install -y fail2ban          # hoặc: sudo dnf install -y fail2ban
sudo systemctl enable --now fail2ban
sudo fail2ban-client status sshd

# SSH: tắt đăng nhập bằng mật khẩu (đảm bảo khoá công khai đã chạy được TRƯỚC)
sudo nano /etc/ssh/sshd_config
#   PasswordAuthentication no
#   PermitRootLogin no
sudo systemctl reload sshd
```

Header bảo mật — thêm vào block `server` 443 ở §7.1:

```nginx
add_header X-Content-Type-Options    "nosniff"                  always;
add_header X-Frame-Options           "SAMEORIGIN"               always;
add_header Referrer-Policy           "strict-origin-when-cross-origin" always;
add_header Permissions-Policy        "camera=(), microphone=(), geolocation=()" always;
# HSTS: chỉ bật sau khi site chạy ổn ÍT NHẤT một tuần. Gỡ ra rất khó.
# add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
```

> Chưa đặt `Content-Security-Policy` có chủ ý: trang nhúng HubSpot
> (`js.hsforms.net`) và Vimeo, viết CSP sai là hỏng form liên hệ và video hero
> mà không có lỗi rõ ràng. Làm riêng, sau, và test từng trang.

---

## 10. Webhook revalidate (Strapi → FE)

Site chạy ISR theo **tag**, không theo thời gian — publish bên CMS mà webhook
không tới thì trang cũ nằm đó tới một tiếng.

`cms.chinasourcing.co/admin` → **Settings → Webhooks → Create new webhook**:

| Ô | Giá trị |
| --- | --- |
| Name | `revalidate-frontend` |
| URL | `https://chinasourcing.co/api/revalidate` |
| Headers | `x-revalidate-secret` : `<REVALIDATE_SECRET ở §4.3>` |
| Events | Entry: publish / unpublish / update / delete • Media: create / update / delete |

Test tay:

```bash
curl -s "https://chinasourcing.co/api/revalidate?secret=<SECRET>&tag=strapi"
#  200 → OK
#  401 → sai secret
#  500 → server chưa đọc được REVALIDATE_SECRET (thiếu trong .env.production)
```

> Webhook đi từ `103.221.223.148` → `chinasourcing.co` → Cloudflare → origin.
> §9.4 không chặn nó vì nó đi qua CF như mọi khách khác.

---

## 11. Vận hành

### 11.1 Deploy lần sau

```bash
# [VPS]
cd /var/www/chinasourcing-clone
git pull                       # hoặc rsync lại từ máy bạn
npm ci
npm run build
pm2 reload chinasourcing-fe    # reload, không phải restart — không rớt request
```

Có bài blog mới kèm ảnh WordPress → chạy lại `§1.3` + `§4.4`.

### 11.2 Khi có sự cố

```bash
pm2 logs chinasourcing-fe --lines 200
pm2 describe chinasourcing-fe            # restart count cao = app đang crash lặp
sudo tail -f /var/log/nginx/error.log
sudo ss -ltnp | grep 3000                # app còn nghe không
curl -I http://127.0.0.1:3000/           # bỏ qua nginx + CF, hỏi thẳng app
```

| Triệu chứng | Nhìn vào đâu trước |
| --- | --- |
| **502** ở mọi trang | app chết (`pm2 logs`) hoặc sai cổng trong `proxy_pass` |
| **502** chỉ ở ảnh/JS | ba `proxy_pass` không cùng cổng — §7.1 |
| **526** | SSL mode `Full (strict)` mà cert origin sai/hết hạn — §6.4 |
| **521** | firewall chặn cả Cloudflare — §9.4, hoặc nginx chết |
| **429** hàng loạt | thiếu real-IP restore — §9.1 |
| **400** ở mọi trang | AOP bật ở nginx mà chưa bật ở CF — §9.5 |
| Vòng lặp chuyển hướng | SSL mode đang `Flexible` — §6.5 |
| Trang hiện nhưng **không bấm được** | Rocket Loader đang ON — §6.7 |
| Ảnh trong bài blog 404 | `public/wp-content` chưa đồng bộ — §4.4 |
| Publish CMS mà trang không đổi | webhook (§10), hoặc đang cache HTML ở biên (§6.6) |

### 11.3 Việc định kỳ

| Việc | Nhịp |
| --- | --- |
| Sinh lại `00-cloudflare-realip.conf` + rule firewall từ danh sách IP CF | 6 tháng |
| Chạy `node scripts/mirror-wp-assets.mjs --check` | mỗi lần thêm bài blog cũ |
| `pm2 logs` soát lỗi lặp | hàng tháng |
| **Gia hạn Origin CA** | **tháng 9/2041** — đặt lịch ngay bây giờ |
