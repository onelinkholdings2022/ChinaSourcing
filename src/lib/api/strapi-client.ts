// ─── StrapiClient — transport HTTP thuần ─────────────────────────────────────
// Chỉ ghép URL + fetch + .json(). KHÔNG biết vertical nào (endpoint sống ở
// Repository). Cache dựa trên Next fetch cache (revalidate + tag 'strapi').
// Kiến trúc theo đúng pattern strapi-client.ts của OlcoMain/strapi-olco.

export const STRAPI_URL = (process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337").replace(/\/$/, "");

const IS_DEV = process.env.NODE_ENV !== "production";
const DEFAULT_REVALIDATE = 3600;
const HARD_TIMEOUT_MS = 15000;

export interface FetchOptions {
  revalidate?: number;
  tags?: string[];
}

function cacheInit(opts: FetchOptions): RequestInit {
  if (IS_DEV) return { cache: "no-store" };
  return {
    next: {
      revalidate: opts.revalidate ?? DEFAULT_REVALIDATE,
      tags: opts.tags ?? ["strapi"],
    },
  };
}

export class StrapiClient {
  constructor(private readonly baseUrl: string = STRAPI_URL) {}

  /** GET `${baseUrl}/api${path}` → parse JSON. Trả `null` khi lỗi/không ok. */
  async get<T>(path: string, opts: FetchOptions = {}): Promise<T | null> {
    const url = `${this.baseUrl}/api${path.startsWith("/") ? path : `/${path}`}`;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), HARD_TIMEOUT_MS);
    try {
      const res = await fetch(url, { ...cacheInit(opts), signal: controller.signal });
      if (!res.ok) {
        console.error(`[StrapiClient] ${res.status} ${res.statusText} — ${url}`);
        return null;
      }
      return (await res.json()) as T;
    } catch (err) {
      console.error(`[StrapiClient] fetch failed — ${url}`, err);
      return null;
    } finally {
      clearTimeout(timer);
    }
  }

  /** POST JSON `${baseUrl}/api${path}` → parse JSON. Trả `null` khi lỗi/không ok. */
  async post<T>(path: string, body: unknown): Promise<T | null> {
    return (await this.postResult<T>(path, body)).data;
  }

  /** Y hệt `post` nhưng trả kèm HTTP status — dùng khi cần phân biệt "Strapi từ chối" (4xx) với "Strapi hỏng" (5xx/timeout). */
  async postResult<T>(path: string, body: unknown): Promise<{ status: number; data: T | null }> {
    const url = `${this.baseUrl}/api${path.startsWith("/") ? path : `/${path}`}`;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), HARD_TIMEOUT_MS * 2);
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        signal: controller.signal,
      });
      if (!res.ok) {
        console.error(`[StrapiClient] POST ${res.status} ${res.statusText} — ${url}`, await res.text().catch(() => ""));
        return { status: res.status, data: null };
      }
      return { status: res.status, data: (await res.json()) as T };
    } catch (err) {
      console.error(`[StrapiClient] POST failed — ${url}`, err);
      return { status: 0, data: null };
    } finally {
      clearTimeout(timer);
    }
  }
}

/** Singleton transport dùng chung cho mọi Repository. */
export const strapiClient = new StrapiClient();
