import type { QueryBus } from "../cqrs/bus";

// ─── BaseService — Application Service ───────────────────────────────────────
// Service chỉ giữ bus + dispatch Query/Command. KHÔNG biết Handler/Repository.

export abstract class BaseService<TBus = QueryBus> {
  constructor(protected readonly bus: TBus) {}
}
