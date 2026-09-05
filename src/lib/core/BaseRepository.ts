import { strapiClient, StrapiClient, type FetchOptions } from "../api/strapi-client";
import type { StrapiSingle, StrapiList } from "../types/strapi";

// ─── StrapiBaseRepository ────────────────────────────────────────────────────
// Repository giữ transport (strapiClient) + endpoint/populate riêng của vertical.
// KHÔNG chứa business logic. Populate KHÔNG ghép ở đây — controller Strapi
// (`buildDeepPopulate`, strapi-cns/src/utils/deep-populate.ts) đã khai sâu toàn
// bộ populate ở phía server, giống hệt pattern strapi-olco/OlcoMain.

export abstract class StrapiBaseRepository<T> {
  constructor(protected readonly client: StrapiClient = strapiClient) {}

  /** Endpoint gốc của vertical, vd `/api/homepage`. Repo con override. */
  protected abstract getBaseEndpoint(): string;

  /** Đọc 1 Single Type: GET endpoint → trả `data` đã bóc khỏi bọc `{ data }`. */
  protected async fetchSingle(path?: string, opts?: FetchOptions): Promise<T | null> {
    const endpoint = path ?? this.getBaseEndpoint().replace(/^\/api/, "");
    const json = await this.client.get<StrapiSingle<T>>(endpoint, opts);
    return json?.data ?? null;
  }

  /** Đọc 1 Collection Type: GET endpoint → trả mảng `data` (rỗng khi lỗi/không có). */
  protected async fetchList<R>(path: string, opts?: FetchOptions): Promise<R[]> {
    const json = await this.client.get<StrapiList<R>>(path, opts);
    return json?.data ?? [];
  }

  /** POST JSON — tạo/sửa entry. `body` đã đúng hình `{ data: {...} }` mà Strapi REST đòi. */
  protected async postJson<R>(path: string, body: unknown): Promise<R | null> {
    return this.client.post<R>(path, body);
  }

  /** POST JSON nhưng trả kèm HTTP status — phân biệt "Strapi từ chối" (4xx) với "Strapi hỏng" (5xx/timeout). */
  protected async postJsonResult<R>(path: string, body: unknown): Promise<{ status: number; data: R | null }> {
    return this.client.postResult<R>(path, body);
  }
}
