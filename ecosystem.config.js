// Cấu hình pm2 cho VPS — xem docs/DEPLOY_VPS.md §5.2.
//
// Để ở file thay vì gõ cờ trên dòng lệnh vì hai lý do: `next start` lấy cổng từ
// biến môi trường `PORT` (truyền `-p` qua `pm2 start npm -- start -- -p …` phải
// đi qua hai lớp bóc tham số và rất dễ rơi mất), và vì cổng phải khớp
// `INTERNAL_BASE_URL` trong `.env.production` — để cạnh nhau thì còn có chỗ
// nhắc, gõ rời hai nơi thì sớm muộn cũng lệch.
//
//   pm2 start ecosystem.config.js
//   pm2 reload chinasourcing-fe        # deploy lần sau, không rớt request
//
// ⚠️ PORT phải là cổng đã DÒ ĐƯỢC LÀ TRỐNG ở §2.2 — máy này còn 2 project khác.
module.exports = {
  apps: [
    {
      name: "chinasourcing-fe",
      cwd: "/var/www/chinasourcing-clone",
      script: "npm",
      args: "start",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
      // Next tự quản worker; chạy fork một tiến trình là đúng.
      instances: 1,
      exec_mode: "fork",
      max_memory_restart: "1G",
      // Crash liên tục thì dừng hẳn thay vì quay vòng vô tận và làm ngập log.
      max_restarts: 10,
      min_uptime: "30s",
    },
  ],
};
