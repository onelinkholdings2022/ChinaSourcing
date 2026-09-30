# Hướng dẫn deploy lên VPS AlmaLinux + GoDaddy + Cloudflare (SSL 15 năm)

Thứ tự làm theo đúng yêu cầu:

1. **Deploy lên VPS** (AlmaLinux 8/9), đồng thời **trỏ DNS ở GoDaddy song song**
   (vì DNS cần thời gian lan truyền, làm sớm để lúc deploy xong là domain đã chạy).
2. **Cloudflare làm sau cùng**: chuyển nameserver sang Cloudflare, cài
   **Cloudflare Origin Certificate 15 năm**, bật chế độ **Full (strict)**.

```
Giai đoạn 1 (song song)                          Giai đoạn 2 (sau cùng)
┌─────────────────────────────┐                  ┌──────────────────────────────┐
│ A. GoDaddy: trỏ A → IP VPS  │                  │ Cloudflare: add site         │
│ B. VPS: cài Node/Nginx/PM2, │ ──── chạy OK ──▶ │ GoDaddy: đổi nameserver → CF │
│    build & chạy app         │                  │ Origin cert 15 năm + Nginx   │
│ (tuỳ chọn) Let's Encrypt tạm│                  │ SSL/TLS: Full (strict)       │
└─────────────────────────────┘                  └──────────────────────────────┘
```

> Trong toàn bộ file này:
> - `tenmien.com` = domain của bạn
> - `IP_VPS` = IP public của VPS
> - `deploy` = user Linux chạy app (không chạy app bằng root)
>
> Thay cho đúng trước khi copy lệnh.

---

## Mục lục

- [0. Chuẩn bị](#0-chuẩn-bị)
- [1. Trỏ DNS ở GoDaddy (làm NGAY, song song)](#1-trỏ-dns-ở-godaddy-làm-ngay-song-song)
- [2. Cài đặt VPS AlmaLinux](#2-cài-đặt-vps-almalinux)
- [3. Đưa code lên và build](#3-đưa-code-lên-và-build)
- [4. Chạy app bằng PM2](#4-chạy-app-bằng-pm2)
- [5. Nginx reverse proxy (HTTP)](#5-nginx-reverse-proxy-http)
- [6. (Tuỳ chọn) HTTPS tạm bằng Let's Encrypt](#6-tuỳ-chọn-https-tạm-bằng-lets-encrypt)
- [7. Kiểm tra DNS đã lan truyền](#7-kiểm-tra-dns-đã-lan-truyền)
- [8. Cloudflare — chuyển nameserver](#8-cloudflare--chuyển-nameserver)
- [9. Cloudflare — chứng chỉ Origin 15 năm](#9-cloudflare--chứng-chỉ-origin-15-năm)
- [10. Cloudflare — thiết lập khuyến nghị](#10-cloudflare--thiết-lập-khuyến-nghị)
- [11. Cập nhật code về sau](#11-cập-nhật-code-về-sau)
- [12. Strapi CMS trên cùng VPS (nếu có)](#12-strapi-cms-trên-cùng-vps-nếu-có)
- [13. Xử lý lỗi thường gặp](#13-xử-lý-lỗi-thường-gặp)
- [14. Checklist cuối](#14-checklist-cuối)

---

## 0. Chuẩn bị

Cần có trước:

| Thứ cần có | Ghi chú |
|---|---|
| VPS AlmaLinux 8 hoặc 9 | Tối thiểu **2 GB RAM** (build Next.js tốn RAM; 1 GB thì bắt buộc phải thêm swap — xem 2.3) |
| Quyền `root` / SSH vào VPS | |
| Tài khoản GoDaddy quản lý domain | |
| Tài khoản Cloudflare (Free là đủ) | Chỉ cần ở giai đoạn 2 |
| Repo git của project | Nếu repo private cần deploy key (xem 3.1) |
| File `.env` đang chạy ở máy local | Để chép biến môi trường lên server |
| URL Strapi CMS production | Frontend đọc toàn bộ nội dung từ Strapi |

Kiểm tra phiên bản AlmaLinux:

```bash
cat /etc/almalinux-release
```

---

## 1. Trỏ DNS ở GoDaddy (làm NGAY, song song)

Làm bước này **trước tiên**, rồi mới SSH vào VPS cài đặt. Trong lúc bạn cài
(30–60 phút), DNS lan truyền xong.

1. Đăng nhập GoDaddy → **My Products** → cạnh domain bấm **DNS**
   (hoặc **Manage DNS**).
2. Tìm bản ghi **A** có Name `@`:
   - Nếu đang trỏ về "Parked" / "WebsiteBuilder" → **Edit**, đổi **Value** thành `IP_VPS`.
   - Nếu chưa có → **Add New Record** → Type `A`, Name `@`, Value `IP_VPS`.
   - **TTL**: chọn thấp nhất (`600 seconds` / 1/2 hour) để sau này đổi cho nhanh.
3. Bản ghi `www`:
   - GoDaddy mặc định có `CNAME www → @`. Giữ nguyên là được (www sẽ theo IP của `@`).
   - Hoặc xoá nó và tạo `A`, Name `www`, Value `IP_VPS`.
4. Nếu dùng subdomain cho CMS: thêm `A`, Name `cms`, Value `IP_VPS`
   (hoặc IP của server Strapi nếu Strapi ở máy khác).
5. **Đừng xoá** các bản ghi `MX`, `TXT` (SPF/DKIM), `CNAME` của email nếu bạn
   đang dùng email theo domain.
6. Nếu có **Forwarding** (chuyển hướng domain) đang bật trong GoDaddy → **tắt**,
   nó sẽ đè lên bản ghi A.

Kết quả mong muốn:

| Type | Name | Value | TTL |
|---|---|---|---|
| A | @ | `IP_VPS` | 600 |
| CNAME | www | @ | 1 Hour |
| A | cms | `IP_VPS` | 600 *(nếu có)* |

> Chưa đổi nameserver ở bước này. Nameserver vẫn là của GoDaddy
> (`nsXX.domaincontrol.com`). Việc chuyển sang Cloudflare để ở [mục 8](#8-cloudflare--chuyển-nameserver).

---

## 2. Cài đặt VPS AlmaLinux

### 2.1. Đăng nhập & cập nhật hệ thống

```bash
ssh root@IP_VPS

dnf update -y
dnf install -y epel-release
dnf install -y git curl wget nano tar unzip policycoreutils-python-utils
```

Đặt múi giờ (tuỳ chọn):

```bash
timedatectl set-timezone Asia/Ho_Chi_Minh
```

### 2.2. Tạo user `deploy` (không chạy app bằng root)

```bash
adduser deploy
passwd deploy
usermod -aG wheel deploy          # cho phép sudo
```

(Khuyến nghị) chép SSH key của bạn cho user `deploy` — chạy **trên máy của bạn**:

```bash
ssh-copy-id deploy@IP_VPS
```

### 2.3. Thêm swap (bắt buộc nếu RAM ≤ 2 GB)

`next build` dễ bị kill vì thiếu RAM. Tạo 2 GB swap:

```bash
fallocate -l 2G /swapfile
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile
echo '/swapfile none swap sw 0 0' >> /etc/fstab
free -h                           # kiểm tra dòng Swap
```

### 2.4. Firewall (firewalld)

AlmaLinux dùng `firewalld`, không phải `ufw`:

```bash
systemctl enable --now firewalld
firewall-cmd --permanent --add-service=ssh
firewall-cmd --permanent --add-service=http
firewall-cmd --permanent --add-service=https
firewall-cmd --reload
firewall-cmd --list-all            # phải thấy: services: http https ssh
```

> **Không** mở port 3000 ra ngoài. App Next.js nghe ở port 3000 nhưng firewalld
> chặn nó từ internet, chỉ Nginx (cùng máy) gọi vào được.
>
> ⚠️ **Không thêm `-H 127.0.0.1` (hay `-H <ip>` bất kỳ) vào `next start`.** Proxy
> của site rewrite `/<slug>` sang route nội bộ, và với `-H` Next hiểu nhầm đó là
> rewrite ra ngoài: mọi trang chi tiết (`/furniture`, `/incoterms-explained`…) bị
> 301 vòng hoặc đá về trang chủ, trong khi `/about-us` vẫn chạy. Chi tiết ở chú
> thích bước 3 trong `src/proxy.ts`.

> Nếu nhà cung cấp VPS có **firewall riêng ở trang quản trị** (Vultr, AWS
> Security Group, Hetzner Firewall…), nhớ mở cả port 80 và 443 ở đó.

### 2.5. Cài Node.js 22 LTS

Next.js 16 cần Node ≥ 20.9. Cài Node 22 từ NodeSource:

```bash
curl -fsSL https://rpm.nodesource.com/setup_22.x | bash -
dnf install -y nodejs
node -v      # v22.x
npm -v
```

> Nên dùng **đúng major version Node** đang chạy ở máy local
> (chạy `node -v` ở máy bạn để so).

### 2.6. Cài PM2

```bash
npm install -g pm2
```

### 2.7. Cài Nginx

```bash
dnf install -y nginx
systemctl enable --now nginx
nginx -v
```

Mở `http://IP_VPS` trên trình duyệt → thấy trang chào của Nginx/AlmaLinux là OK.

### 2.8. SELinux — BƯỚC HAY BỊ QUÊN NHẤT

AlmaLinux bật SELinux mặc định. Nếu không cấp quyền, Nginx **không được phép**
kết nối tới app ở port 3000 và bạn sẽ gặp **502 Bad Gateway** dù app vẫn chạy.

```bash
getenforce                                   # thường là: Enforcing
setsebool -P httpd_can_network_connect 1     # cho Nginx proxy tới app
```

Không tắt SELinux — chỉ cần bật boolean trên là đủ.

---

## 3. Đưa code lên và build

Từ đây trở đi làm bằng user `deploy`:

```bash
su - deploy
```

### 3.1. Clone repo

**Repo public:**

```bash
git clone https://github.com/<user>/<repo>.git ~/chinasourcing
```

**Repo private** — tạo deploy key:

```bash
ssh-keygen -t ed25519 -C "deploy@vps" -f ~/.ssh/id_ed25519 -N ""
cat ~/.ssh/id_ed25519.pub
```

Copy nội dung in ra → GitHub repo → **Settings → Deploy keys → Add deploy key**
(chỉ cần quyền read) → rồi:

```bash
ssh -T git@github.com            # gõ "yes" lần đầu
git clone git@github.com:<user>/<repo>.git ~/chinasourcing
```

### 3.2. Tạo file biến môi trường

```bash
cd ~/chinasourcing
nano .env.production
```

Dán **toàn bộ** biến từ file `.env` ở máy local, sửa các URL cho đúng production.
Các biến đã biết của project (đối chiếu với `.env` local để đủ):

```dotenv
# URL Strapi CMS (dùng HTTPS nếu CMS đã có SSL)
NEXT_PUBLIC_STRAPI_URL=https://cms.tenmien.com

# Token đọc API Strapi (nếu project dùng) — lấy từ .env local
# STRAPI_API_TOKEN=...

# HubSpot newsletter footer (lưới đỡ khi CMS thiếu cấu hình)
NEXT_PUBLIC_HUBSPOT_PORTAL_ID=46681098
NEXT_PUBLIC_HUBSPOT_NEWSLETTER_FORM_ID=e30221f0-7060-4147-9b7b-4dc9593f7828
NEXT_PUBLIC_HUBSPOT_REGION=na1

# ...các biến khác có trong .env local (URL site, file sourcing guide, v.v.)
```

Liệt kê tất cả biến mà code đang đọc để không sót (chạy trong thư mục project):

```bash
grep -rhoE "process\.env\.[A-Z0-9_]+" src | sort -u
```

```bash
chmod 600 .env.production
```

> ⚠️ **Quan trọng:** các biến `NEXT_PUBLIC_*` được **gắn cứng vào bundle lúc
> build**. Đổi giá trị thì phải `npm run build` lại, restart thôi là không đủ.

### 3.3. Cài dependency và build

```bash
cd ~/chinasourcing
npm ci
npm run build
```

Build thành công sẽ kết thúc bằng bảng liệt kê route. Nếu bị `Killed` → thiếu
RAM, xem lại [2.3](#23-thêm-swap-bắt-buộc-nếu-ram--2-gb).

> Lúc build, Next.js gọi Strapi để lấy dữ liệu. **VPS phải truy cập được URL
> Strapi** — kiểm tra: `curl -I $NEXT_PUBLIC_STRAPI_URL/api/global`.

Chạy thử:

```bash
npm run start -- -p 3000
# mở SSH thứ 2 và chạy:
curl -I http://127.0.0.1:3000        # mong đợi: HTTP/1.1 200 OK
```

`Ctrl + C` để dừng, sang bước PM2.

---

## 4. Chạy app bằng PM2

Tạo file `~/chinasourcing/ecosystem.config.js`:

```bash
nano ~/chinasourcing/ecosystem.config.js
```

```js
module.exports = {
  apps: [
    {
      name: "chinasourcing",
      cwd: "/home/deploy/chinasourcing",
      script: "node_modules/next/dist/bin/next",
      args: "start -p 3000",
      env: {
        NODE_ENV: "production",
      },
      instances: 1,
      autorestart: true,
      max_memory_restart: "1G",
    },
  ],
};
```

Khởi động:

```bash
cd ~/chinasourcing
pm2 start ecosystem.config.js
pm2 status                 # trạng thái: online
pm2 logs chinasourcing     # xem log, Ctrl+C để thoát
pm2 save
```

Tự khởi động PM2 khi reboot VPS:

```bash
pm2 startup systemd -u deploy --hp /home/deploy
```

Lệnh trên in ra một dòng bắt đầu bằng `sudo env PATH=...` → **copy và chạy dòng
đó**. Sau đó:

```bash
pm2 save
```

---

## 5. Nginx reverse proxy (HTTP)

Quay lại root (`exit` khỏi user deploy, hoặc dùng `sudo`).

Trên AlmaLinux, cấu hình site đặt trong **`/etc/nginx/conf.d/*.conf`**
(không có `sites-available` / `sites-enabled` như Ubuntu).

```bash
nano /etc/nginx/conf.d/chinasourcing.conf
```

```nginx
upstream chinasourcing.co {
    server 127.0.0.1:3000;
    keepalive 64;
}

server {
    listen 80;
    listen [::]:80;
    server_name chinasourcing.co;

    client_max_body_size 50M;

    # Asset tĩnh đã hash tên file — cache lâu
    location /_next/static/ {
        proxy_pass http://chinasourcing.co;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    location / {
        proxy_pass http://chinasourcing.co;
        proxy_http_version 1.1;
        proxy_set_header Host              $host;
        proxy_set_header X-Real-IP         $remote_addr;
        proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Upgrade           $http_upgrade;
        proxy_set_header Connection        "upgrade";
        proxy_read_timeout 60s;
    }
}
```

Kiểm tra và nạp lại:

```bash
nginx -t
systemctl reload nginx
```

Test ngay cả khi DNS **chưa** lan truyền xong:

```bash
curl -I -H "Host: tenmien.com" http://IP_VPS
# mong đợi: HTTP/1.1 200 OK
```

Hoặc trên máy của bạn, sửa file hosts (`/etc/hosts` trên macOS) thêm dòng
`IP_VPS tenmien.com www.tenmien.com` rồi mở `http://tenmien.com`
(nhớ xoá dòng đó sau khi test).

> Gặp **502** → gần như chắc chắn là quên [2.8 SELinux](#28-selinux--bước-hay-bị-quên-nhất)
> hoặc app PM2 chưa chạy.

---

## 6. (Tuỳ chọn) HTTPS tạm bằng Let's Encrypt

Giai đoạn chờ trước khi chuyển sang Cloudflare, site chỉ có HTTP. Nếu khoảng
thời gian đó dài (vài ngày trở lên) hoặc bạn muốn chạy thật ngay, cài Let's
Encrypt tạm. **Bỏ qua bước này** nếu định chuyển sang Cloudflare ngay trong ngày.

Chỉ làm **sau khi** DNS đã trỏ đúng ([mục 7](#7-kiểm-tra-dns-đã-lan-truyền)):

```bash
dnf install -y certbot python3-certbot-nginx
certbot --nginx -d chinasourcing.co 
```

Chọn chuyển hướng HTTP → HTTPS khi được hỏi. Certbot tự sửa file
`chinasourcing.conf`.

> Ở mục 9 ta sẽ thay chứng chỉ này bằng Origin Certificate 15 năm của Cloudflare
> và tắt gia hạn của certbot.

---

## 7. Kiểm tra DNS đã lan truyền

Trên máy của bạn:

```bash
dig +short chinasourcing.co
dig +short www.tenmien.com
# cả hai phải trả về IP_VPS
```

Hoặc xem toàn cầu tại https://dnschecker.org (chọn loại `A`).

Khi đa số điểm đã ra `IP_VPS` → mở `http://tenmien.com` kiểm tra toàn bộ site:
trang chủ, `/about-us`, `/products`, một trang bài viết, form liên hệ…

✅ **Hết giai đoạn 1.** Site đã chạy trên VPS bằng domain thật.

---

## 8. Cloudflare — chuyển nameserver

### 8.1. Thêm domain vào Cloudflare

1. https://dash.cloudflare.com → **Add a domain** (hoặc *Add site*) → nhập
   `tenmien.com` → chọn gói **Free**.
2. Cloudflare tự quét DNS hiện có từ GoDaddy. **Soát kỹ danh sách**:
   - `A  @    IP_VPS`   → Proxy status: **Proxied** (đám mây cam 🟠)
   - `CNAME www @` hoặc `A www IP_VPS` → **Proxied** 🟠
   - `A  cms  IP_VPS` (nếu có) → **Proxied** 🟠
   - `MX`, `TXT` (SPF/DKIM/verification) → giữ nguyên, **DNS only** (xám)
   - Bản ghi email kiểu `mail`, `autodiscover`… → **DNS only** (xám)
   - Xoá bản ghi rác của GoDaddy nếu có (`_domainconnect`, bản ghi trỏ về parking…).
   - Nếu thiếu bản ghi nào so với GoDaddy → thêm tay cho đủ **trước khi** đổi
     nameserver, nếu không email/dịch vụ phụ sẽ đứt.
3. Cloudflare hiển thị **2 nameserver**, dạng:
   ```
   ada.ns.cloudflare.com
   bob.ns.cloudflare.com
   ```

### 8.2. Chuẩn bị SSL TRƯỚC khi đổi nameserver (tránh downtime)

Làm luôn [mục 9](#9-cloudflare--chứng-chỉ-origin-15-năm) **ngay bây giờ** — tạo
và cài Origin Certificate lên VPS, đặt chế độ SSL **Full (strict)** — rồi mới đổi
nameserver. Lý do: ngay khi nameserver đổi, traffic đi qua Cloudflare; nếu lúc đó
chế độ SSL chưa đúng hoặc VPS chưa có cert trên 443, site sẽ lỗi 521/525/526 hoặc
lặp redirect.

> Mục 9 tạo được cert kể cả khi domain chưa Active trên Cloudflare.

### 8.3. Đổi nameserver ở GoDaddy

1. GoDaddy → **My Products** → domain → **DNS** → tab **Nameservers** →
   **Change Nameservers**.
2. Chọn **"I'll use my own nameservers"**.
3. Xoá 2 nameserver `domaincontrol.com`, nhập 2 nameserver Cloudflare ở 8.1 → **Save**.
4. **DNSSEC:** nếu GoDaddy đang bật DNSSEC → **tắt trước khi đổi**
   (Domain Settings → DNSSEC). DNSSEC cũ + nameserver mới = domain không phân giải.
   Có thể bật lại DNSSEC từ phía Cloudflare sau khi Active.

### 8.4. Chờ Active

- Cloudflare gửi email khi domain **Active** (thường 5 phút – vài giờ, tối đa 24–48h).
- Bấm **Check nameservers now** trong dashboard để kiểm tra sớm.
- Kiểm tra: `dig NS tenmien.com +short` → phải ra nameserver Cloudflare.

> Sau khi đổi nameserver, **mọi chỉnh sửa DNS phải làm ở Cloudflare**. Bảng DNS
> bên GoDaddy không còn tác dụng nữa.

---

## 9. Cloudflare — chứng chỉ Origin 15 năm

### 9.1. Tạo chứng chỉ

1. Cloudflare → chọn domain → **SSL/TLS** → **Origin Server** → **Create Certificate**.
2. Chọn:
   - **Generate private key and CSR with Cloudflare**
   - Private key type: **RSA (2048)**
   - Hostnames: `tenmien.com`, `*.tenmien.com` (wildcard phủ luôn `www`, `cms`…)
   - **Certificate Validity: 15 years**
3. **Create**. Chọn **Key format: PEM** và copy hai khung:
   - **Origin Certificate**
   - **Private Key** — ⚠️ **chỉ hiện MỘT LẦN**. Lưu ngay vào trình quản lý
     mật khẩu. Mất thì phải tạo cert mới.

### 9.2. Cài lên VPS

Trên VPS (root). Dùng thư mục `/etc/pki/nginx/` — thư mục chuẩn của AlmaLinux,
SELinux đã gán đúng nhãn:

```bash
mkdir -p /etc/pki/nginx/private

nano /etc/pki/nginx/chinasourcing.co.pem
# dán Origin Certificate (gồm cả dòng -----BEGIN CERTIFICATE----- và -----END CERTIFICATE-----)

nano /etc/pki/nginx/private/chinasourcing.co.key
# dán Private Key (gồm cả dòng BEGIN/END)

chmod 644 /etc/pki/nginx/chinasourcing.co.pem
chmod 600 /etc/pki/nginx/private/chinasourcing.co.key
chown root:root /etc/pki/nginx/chinasourcing.co.pem /etc/pki/nginx/private/chinasourcing.co.key

# gán lại nhãn SELinux (bắt buộc nếu bạn upload file bằng scp rồi mv vào)
restorecon -Rv /etc/pki/nginx
```

(Tuỳ chọn) tải CA gốc của Cloudflare Origin để dùng cho authenticated origin pulls
về sau — không bắt buộc cho các bước dưới.

### 9.3. Cấu hình Nginx HTTPS

Nếu đã làm [mục 6](#6-tuỳ-chọn-https-tạm-bằng-lets-encrypt) (Let's Encrypt), tắt
gia hạn của certbot vì không còn dùng:

```bash
systemctl disable --now certbot-renew.timer 2>/dev/null
```

Ghi đè **toàn bộ** `/etc/nginx/conf.d/chinasourcing.conf`:

```bash
nano /etc/nginx/conf.d/chinasourcing.conf
```

```nginx
upstream chinasourcing_app {
    server 127.0.0.1:3000;
    keepalive 64;
}

# HTTP → HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name tenmien.com www.tenmien.com;
    return 301 https://tenmien.com$request_uri;
}

# www → non-www
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name www.tenmien.com;

    ssl_certificate     /etc/pki/nginx/tenmien.com.pem;
    ssl_certificate_key /etc/pki/nginx/private/tenmien.com.key;

    return 301 https://tenmien.com$request_uri;
}

# Site chính
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name tenmien.com;

    ssl_certificate     /etc/pki/nginx/tenmien.com.pem;
    ssl_certificate_key /etc/pki/nginx/private/tenmien.com.key;
    ssl_protocols       TLSv1.2 TLSv1.3;
    ssl_session_cache   shared:SSL:10m;
    ssl_session_timeout 1d;

    client_max_body_size 50M;

    location /_next/static/ {
        proxy_pass http://chinasourcing_app;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    location / {
        proxy_pass http://chinasourcing_app;
        proxy_http_version 1.1;
        proxy_set_header Host              $host;
        proxy_set_header X-Real-IP         $remote_addr;
        proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto https;
        proxy_set_header Upgrade           $http_upgrade;
        proxy_set_header Connection        "upgrade";
        proxy_read_timeout 60s;
    }
}
```

> Nginx ≥ 1.25 sẽ cảnh báo `listen ... http2` là cú pháp cũ — vẫn chạy bình thường.
> Muốn hết cảnh báo thì đổi thành `listen 443 ssl;` + dòng `http2 on;`.

```bash
nginx -t
systemctl reload nginx
```

### 9.4. Đặt chế độ SSL ở Cloudflare

Cloudflare → **SSL/TLS** → **Overview** → chọn **Full (strict)**.

| Chế độ | Dùng? | Lý do |
|---|---|---|
| Off / Flexible | ❌ | Flexible + redirect HTTPS ở Nginx = **lặp redirect vô hạn** |
| Full | ⚠️ | Chạy được nhưng không xác thực cert origin |
| **Full (strict)** | ✅ | Xác thực Origin Certificate — đúng mục đích |

### 9.5. Lưu ý sống còn về Origin Certificate

- Cert này **chỉ Cloudflare tin**, trình duyệt thì không.
- Vì vậy mọi bản ghi web (`@`, `www`, `cms`) **phải luôn để Proxied 🟠**.
  Chuyển sang DNS only (xám) → khách truy cập thẳng VPS → trình duyệt báo
  "Kết nối không riêng tư".
- Cert hết hạn sau 15 năm — ghi lịch nhắc ngày tạo + 15 năm.

---

## 10. Cloudflare — thiết lập khuyến nghị

**SSL/TLS → Edge Certificates**

- **Always Use HTTPS**: On
- **Automatic HTTPS Rewrites**: On
- **Minimum TLS Version**: TLS 1.2
- **HSTS**: chỉ bật sau khi đã chạy ổn vài ngày (bật rồi khó quay lại HTTP).

**Speed / Caching**

- **Caching → Configuration → Browser Cache TTL**: *Respect Existing Headers*
  (Next.js tự đặt header cache đúng).
- **Speed → Optimization**: **tắt Rocket Loader** — nó can thiệp script, dễ làm
  vỡ React/GSAP/HubSpot. Auto Minify đã bị Cloudflare bỏ, không cần tìm.
- Không bật "Cache Everything" cho toàn site — trang Next.js render động từ CMS,
  cache toàn site sẽ làm nội dung mới không hiện.

**Network**

- **WebSockets**: On (mặc định)

### 10.1. Lấy IP thật của khách trong log Nginx

Sau khi qua Cloudflare, `$remote_addr` là IP của Cloudflare. Khôi phục IP thật:

```bash
nano /etc/nginx/conf.d/cloudflare-realip.conf
```

```nginx
# Danh sách IP Cloudflare: https://www.cloudflare.com/ips/
set_real_ip_from 173.245.48.0/20;
set_real_ip_from 103.21.244.0/22;
set_real_ip_from 103.22.200.0/22;
set_real_ip_from 103.31.4.0/22;
set_real_ip_from 141.101.64.0/18;
set_real_ip_from 108.162.192.0/18;
set_real_ip_from 190.93.240.0/20;
set_real_ip_from 188.114.96.0/20;
set_real_ip_from 197.234.240.0/22;
set_real_ip_from 198.41.128.0/17;
set_real_ip_from 162.158.0.0/15;
set_real_ip_from 104.16.0.0/13;
set_real_ip_from 104.24.0.0/14;
set_real_ip_from 172.64.0.0/13;
set_real_ip_from 131.0.72.0/22;
set_real_ip_from 2400:cb00::/32;
set_real_ip_from 2606:4700::/32;
set_real_ip_from 2803:f800::/32;
set_real_ip_from 2405:b500::/32;
set_real_ip_from 2405:8100::/32;
set_real_ip_from 2a06:98c0::/29;
set_real_ip_from 2c0f:f248::/32;
real_ip_header CF-Connecting-IP;
```

```bash
nginx -t && systemctl reload nginx
```

> Danh sách IP có thể thay đổi — đối chiếu lại với https://www.cloudflare.com/ips/.

### 10.2. (Tuỳ chọn, nâng cao) Chỉ cho Cloudflare vào port 80/443

Chặn truy cập thẳng bằng IP, buộc mọi traffic đi qua Cloudflare:

```bash
firewall-cmd --permanent --remove-service=http
firewall-cmd --permanent --remove-service=https
for ip in $(curl -s https://www.cloudflare.com/ips-v4); do
  firewall-cmd --permanent --add-rich-rule="rule family=ipv4 source address=$ip port port=80 protocol=tcp accept"
  firewall-cmd --permanent --add-rich-rule="rule family=ipv4 source address=$ip port port=443 protocol=tcp accept"
done
for ip in $(curl -s https://www.cloudflare.com/ips-v6); do
  firewall-cmd --permanent --add-rich-rule="rule family=ipv6 source address=$ip port port=80 protocol=tcp accept"
  firewall-cmd --permanent --add-rich-rule="rule family=ipv6 source address=$ip port port=443 protocol=tcp accept"
done
firewall-cmd --reload
```

> ⚠️ Sau bước này, `curl http://IP_VPS` từ ngoài sẽ không vào được nữa (đúng ý đồ),
> và Let's Encrypt HTTP-01 cũng không chạy được. Chỉ làm khi mọi thứ đã ổn định.

---

## 11. Cập nhật code về sau

Tạo script `~/chinasourcing/deploy.sh` (user `deploy`):

```bash
nano ~/chinasourcing/deploy.sh
```

```bash
#!/usr/bin/env bash
set -euo pipefail
cd /home/deploy/chinasourcing

echo "==> Pull code"
git pull --ff-only

echo "==> Cài dependency"
npm ci

echo "==> Build"
npm run build

echo "==> Restart"
pm2 reload chinasourcing --update-env
pm2 save

echo "==> Xong"
```

```bash
chmod +x ~/chinasourcing/deploy.sh
```

Mỗi lần cập nhật:

```bash
ssh deploy@IP_VPS
~/chinasourcing/deploy.sh
```

Sau khi deploy, nếu thấy trang cũ → Cloudflare → **Caching → Configuration →
Purge Everything**.

> Nếu build thất bại, bản đang chạy vẫn là bản cũ **cho tới khi** `.next` bị ghi
> đè. Muốn zero-downtime tuyệt đối thì build ở thư mục riêng rồi đổi symlink —
> chưa cần cho quy mô hiện tại.

---

## 12. Strapi CMS trên cùng VPS (nếu có)

Bỏ qua nếu Strapi chạy ở server khác.

1. Clone `strapi-cns` vào `/home/deploy/strapi-cns`, tạo `.env`, `npm ci`,
   `npm run build`.
2. Thêm vào `ecosystem.config.js` (hoặc file riêng):
   ```js
   {
     name: "strapi",
     cwd: "/home/deploy/strapi-cns",
     script: "npm",
     args: "run start",
     env: { NODE_ENV: "production", HOST: "127.0.0.1", PORT: "1337" },
   }
   ```
3. Nginx: file `/etc/nginx/conf.d/cms.conf`, giống khối 443 ở 9.3 nhưng
   `server_name cms.tenmien.com;` và `proxy_pass http://127.0.0.1:1337;`.
   Wildcard cert `*.tenmien.com` dùng chung được, không cần tạo cert mới.
4. `client_max_body_size 100M;` để upload ảnh vào Media Library.
5. Bản ghi DNS `cms` phải là **Proxied** 🟠.
6. Cloudflare Free giới hạn upload **100 MB/request**.
7. Nhớ `.env` của Strapi có `URL=https://cms.tenmien.com` để link ảnh/admin đúng.

**Thứ tự khởi động:** Strapi phải chạy **trước** khi `npm run build` frontend, vì
build lấy dữ liệu từ CMS.

---

## 13. Xử lý lỗi thường gặp

| Triệu chứng | Nguyên nhân hay gặp | Cách xử lý |
|---|---|---|
| **502 Bad Gateway** (Nginx) | SELinux chặn Nginx proxy | `setsebool -P httpd_can_network_connect 1` |
| 502 | App PM2 không chạy / crash | `pm2 status`, `pm2 logs chinasourcing --lines 100` |
| Nginx không start, lỗi đọc cert | Nhãn SELinux của file cert sai | `restorecon -Rv /etc/pki/nginx` |
| `npm run build` báo `Killed` | Thiếu RAM | Thêm swap (2.3) |
| Build lỗi fetch / ECONNREFUSED | VPS không gọi được Strapi | Kiểm tra `NEXT_PUBLIC_STRAPI_URL`, `curl` thử từ VPS |
| Trang lên nhưng trống nội dung | Sai URL CMS hoặc CMS 403 | Xem log PM2; kiểm tra quyền Public trong Strapi |
| Đổi `.env` mà không ăn | Biến `NEXT_PUBLIC_*` gắn lúc build | `npm run build` lại rồi `pm2 reload` |
| **ERR_TOO_MANY_REDIRECTS** | Cloudflare để **Flexible** | Đổi sang **Full (strict)** |
| **Cloudflare 521** | Nginx tắt / firewall chặn 443 | `systemctl status nginx`, `firewall-cmd --list-all` |
| **Cloudflare 522** | Timeout tới VPS | Firewall nhà cung cấp VPS chưa mở 80/443 |
| **Cloudflare 525** | Nginx không nghe 443 hoặc lỗi SSL handshake | Kiểm tra khối `listen 443 ssl` và đường dẫn cert |
| **Cloudflare 526** | Cert origin không hợp lệ với Full (strict) | Cert sai / hostname không khớp / dán thiếu dòng BEGIN-END |
| Trình duyệt báo cert không tin cậy | Bản ghi DNS để **DNS only** (xám) | Bật lại **Proxied** 🟠 |
| Domain không phân giải sau đổi NS | DNSSEC còn bật ở GoDaddy | Tắt DNSSEC ở GoDaddy |
| Email theo domain mất | Thiếu bản ghi MX/TXT khi chuyển sang CF | Thêm lại MX/TXT trong Cloudflare DNS |
| Form HubSpot / video lỗi sau khi qua CF | Rocket Loader | Tắt Rocket Loader |

Lệnh xem log nhanh:

```bash
pm2 logs chinasourcing --lines 200
tail -f /var/log/nginx/error.log
journalctl -u nginx -e
ausearch -m avc -ts recent        # log từ chối của SELinux
```

---

## 14. Checklist cuối

**Giai đoạn 1 — Deploy + DNS GoDaddy**

- [ ] GoDaddy: `A @ → IP_VPS`, `www` trỏ đúng, TTL thấp, tắt Forwarding
- [ ] VPS: update, user `deploy`, swap, firewalld mở http/https
- [ ] Node 22, PM2, Nginx đã cài
- [ ] `setsebool -P httpd_can_network_connect 1`
- [ ] `.env.production` đủ biến, `npm run build` thành công
- [ ] PM2 `online`, đã `pm2 startup` + `pm2 save`
- [ ] Nginx proxy port 80, `curl -H "Host: tenmien.com" http://IP_VPS` → 200
- [ ] `dig +short tenmien.com` → `IP_VPS`, mở site bằng domain thấy đúng

**Giai đoạn 2 — Cloudflare**

- [ ] Add site, soát đủ bản ghi DNS, web records = Proxied 🟠
- [ ] Tạo Origin Certificate **15 năm**, lưu private key an toàn
- [ ] Cài cert vào `/etc/pki/nginx/`, `restorecon`, Nginx 443 OK (`nginx -t`)
- [ ] SSL/TLS = **Full (strict)**
- [ ] Tắt DNSSEC ở GoDaddy → đổi nameserver sang Cloudflare
- [ ] Cloudflare báo **Active**
- [ ] Always Use HTTPS, Automatic HTTPS Rewrites, TLS ≥ 1.2, tắt Rocket Loader
- [ ] Real IP config
- [ ] Kiểm tra: `https://tenmien.com` ổ khoá xanh, `http://` và `www` đều 301 về `https://tenmien.com`
- [ ] Test form liên hệ HubSpot, newsletter, trang bài viết, video hero
- [ ] Ghi lịch nhắc hết hạn Origin Certificate (ngày tạo + 15 năm)
