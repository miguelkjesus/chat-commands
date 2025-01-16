export type Callable = (...args: any[]) => any;

export function isCallable(maybeFunc: unknown): maybeFunc is Callable {
  return typeof maybeFunc === "function";
}
