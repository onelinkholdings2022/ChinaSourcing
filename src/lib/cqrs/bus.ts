// ─── CQRS QueryBus / CommandBus ──────────────────────────────────────────────
// Application Service KHÔNG biết Handler — chỉ dispatch Query/Command qua bus.
// Mapping `type → handler` sống DUY NHẤT ở container.ts.
//
// Neo singleton vào `globalThis` (không `static instance`): Next dev HMR có thể
// nạp file này thành nhiều bản, mỗi bản có `static instance` riêng nếu không
// neo — thành nhiều "singleton" rỗng đứng cạnh nhau.

export interface IQuery<_TResult = unknown> {
  readonly type: string;
}

export interface IQueryHandler<Q extends IQuery<TResult>, TResult> {
  execute(query: Q): Promise<TResult | null>;
}

const QUERY_BUS_KEY = "__cnsQueryBus";
type QueryGlobalStore = typeof globalThis & { [QUERY_BUS_KEY]?: QueryBus };

export class QueryBus {
  private readonly handlers = new Map<string, IQueryHandler<IQuery, unknown>>();

  static getInstance(): QueryBus {
    const store = globalThis as QueryGlobalStore;
    if (!store[QUERY_BUS_KEY]) store[QUERY_BUS_KEY] = new QueryBus();
    return store[QUERY_BUS_KEY];
  }

  register<TResult>(type: string, handler: IQueryHandler<IQuery<TResult>, TResult>): void {
    if (this.handlers.has(type)) {
      throw new Error(`[QueryBus] duplicate handler for "${type}"`);
    }
    this.handlers.set(type, handler as IQueryHandler<IQuery, unknown>);
  }

  async dispatch<TResult>(query: IQuery<TResult>): Promise<TResult | null> {
    const handler = this.handlers.get(query.type);
    if (!handler) throw new Error(`[QueryBus] no handler for "${query.type}"`);
    return handler.execute(query) as Promise<TResult | null>;
  }
}

export interface ICommand<_TResult = unknown> {
  readonly type: string;
}

export interface ICommandHandler<C extends ICommand<TResult>, TResult> {
  execute(command: C): Promise<TResult>;
}

const COMMAND_BUS_KEY = "__cnsCommandBus";
type CommandGlobalStore = typeof globalThis & { [COMMAND_BUS_KEY]?: CommandBus };

export class CommandBus {
  private readonly handlers = new Map<string, ICommandHandler<ICommand, unknown>>();

  static getInstance(): CommandBus {
    const store = globalThis as CommandGlobalStore;
    if (!store[COMMAND_BUS_KEY]) store[COMMAND_BUS_KEY] = new CommandBus();
    return store[COMMAND_BUS_KEY];
  }

  register<TResult>(type: string, handler: ICommandHandler<ICommand<TResult>, TResult>): void {
    if (this.handlers.has(type)) {
      throw new Error(`[CommandBus] duplicate handler for "${type}"`);
    }
    this.handlers.set(type, handler as ICommandHandler<ICommand, unknown>);
  }

  async dispatch<TResult>(command: ICommand<TResult>): Promise<TResult> {
    const handler = this.handlers.get(command.type);
    if (!handler) throw new Error(`[CommandBus] no handler for "${command.type}"`);
    return handler.execute(command) as Promise<TResult>;
  }
}
