export type Callable = (...args: any[]) => any;

export function isCallable(maybeFunc: unknown): maybeFunc is Callable {
  return typeof maybeFunc === "function";
}

export type Simplify<T> = T extends any[] | Date
  ? T
  : {
      [K in keyof T]: T[K];
    } & {};
