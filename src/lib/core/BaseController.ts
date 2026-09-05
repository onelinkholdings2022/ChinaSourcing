// ─── BaseController — ranh giới promise/error ────────────────────────────────
// Controller "mỏng": chỉ nhận request, gọi service, trả kết quả. Mọi controller
// bọc thao tác qua handle() để tập trung chỗ bắt lỗi (không ném ra tới page).

export interface Result<T> {
  data: T | null;
  error?: string;
}

export abstract class BaseController {
  protected async handle<T>(operation: () => Promise<T | null>): Promise<Result<T>> {
    try {
      const data = await operation();
      return { data };
    } catch (err) {
      console.error("[Controller] operation failed", err);
      return { data: null, error: err instanceof Error ? err.message : "unknown error" };
    }
  }
}
