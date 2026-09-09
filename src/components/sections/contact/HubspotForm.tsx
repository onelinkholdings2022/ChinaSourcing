"use client";

import { useEffect, useId, useRef } from "react";
import { markSubscribed } from "@/hooks/useSubscribed";

const EMBED_SCRIPT = "https://js.hsforms.net/forms/embed/v2.js";

type FormsApi = {
  create: (options: {
    portalId: string;
    formId: string;
    region: string;
    target: string;
    onFormSubmitted?: () => void;
  }) => void;
};

declare global {
  interface Window {
    hbspt?: { forms: FormsApi };
  }
}

/**
 * A HubSpot embedded form — the contact form on `/contact-us`.
 *
 * The original calls `hbspt.forms.create()` from a `<script>` sitting inside
 * the box it wants to fill, which renders the form at the script's position.
 * That has no React equivalent, so this passes an explicit `target` instead;
 * the rendered markup is the same cross-origin `iframe.hs-form-iframe`.
 *
 * ## Gửi form liên hệ KHÔNG mở khoá bài viết nữa
 *
 * Theme gốc cho MỌI form của site set `localStorage.onelink_subscribed` khi
 * submit — cùng cái cờ dỡ paywall bài viết (xem `useSubscribed`). Nghĩa là chỉ
 * cần hỏi một câu qua form "Get In Touch" là đọc miễn phí toàn bộ blog, vĩnh
 * viễn, trên máy đó. Đó là lý do chính chủ site thử nghiệm xong rồi không bao
 * giờ thấy paywall của mình nữa.
 *
 * Xin báo giá không phải là đăng ký nhận nội dung, nên mặc định form này không
 * còn set cờ. Chỗ mở khoá đúng nghĩa là form email ngay dưới bài
 * (`SubscribeForm`). Cần trả lại hành vi của theme thì truyền
 * `unlocksContent`.
 */
export function HubspotForm({
  portalId,
  formId,
  region = "na1",
  className,
  unlocksContent = false,
}: {
  portalId: string;
  formId: string;
  region?: string;
  className?: string;
  /** Submit form này có dỡ paywall bài viết không. Xem chú thích trên. */
  unlocksContent?: boolean;
}) {
  const targetId = useId().replace(/:/g, "");
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    // `hbspt.forms.create` với id rỗng ném lỗi và bỏ lại một hộp trống, nên
    // chưa cấu hình thì không dựng gì cả.
    if (!host || !portalId || !formId) return;

    let cancelled = false;
    const render = () => {
      if (cancelled || !window.hbspt) return;
      host.innerHTML = "";
      window.hbspt.forms.create({
        portalId,
        formId,
        region,
        target: `#${targetId}`,
        // `markSubscribed()` chứ không phải `localStorage.setItem` trực tiếp:
        // nó còn phát sự kiện để thân bài và form email đang mở cùng cập nhật.
        ...(unlocksContent ? { onFormSubmitted: markSubscribed } : {}),
      });
    };

    if (window.hbspt) {
      render();
      return () => {
        cancelled = true;
      };
    }

    // One shared loader: several pages can mount a form, and v2.js only needs
    // to run once for `window.hbspt` to exist.
    let script = document.querySelector<HTMLScriptElement>(
      `script[src="${EMBED_SCRIPT}"]`,
    );
    if (!script) {
      script = document.createElement("script");
      script.src = EMBED_SCRIPT;
      script.async = true;
      document.body.appendChild(script);
    }
    script.addEventListener("load", render);

    return () => {
      cancelled = true;
      script?.removeEventListener("load", render);
    };
  }, [portalId, formId, region, targetId, unlocksContent]);

  return <div id={targetId} ref={hostRef} className={className} />;
}
