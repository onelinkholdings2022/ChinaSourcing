"use client";

import { Button } from "@/components/ui/button";
import type { ComponentProps } from "react";

/**
 * Nút tải file, dựng đúng cách site gốc làm: tạo tạm một `<a download>` rồi tự
 * bấm, nên trình duyệt mở hộp tải xuống thay vì điều hướng sang PDF.
 *
 * Không phải link, nên nó là `<button>` — giống hệt `#downloadBtn` (hero
 * homepage) và `#downloadBtnCta` (/resources) bên site gốc.
 */
export function DownloadButton({
  fileUrl,
  children,
  ...props
}: { fileUrl: string } & Omit<ComponentProps<typeof Button>, "href">) {
  const download = () => {
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = "";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Button type="button" onClick={download} {...props}>
      {children}
    </Button>
  );
}
