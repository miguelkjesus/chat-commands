type Callable = (...args: any[]) => any

function isCallable(maybeFunc: unknown): maybeFunc is Callable {
  return typeof maybeFunc === "function";
}


export type GetterOrValue<Getter extends Callable> = Getter | ReturnType<Getter>;
export type ValueOrContextualGetter<Value, Context> = GetterOrValue<(context: Context) => Value>;

export function get<Getter extends Callable>(getter: Getter | ReturnType<Getter>, params: Parameters<Getter>) {
  if (isCallable(getter)) {
    return getter(...params);
  }
  return getter;
}
