type Callable = (...args: any[]) => any

function isCallable(maybeFunc: unknown): maybeFunc is Callable {
  return typeof maybeFunc === "function";
}

export function get<Getter extends Callable>(getter: Getter | ReturnType<Getter>, params: Parameters<Getter>) {
  if (isCallable(getter)) {
    return getter(...params);
  }
  return getter;
}

export type GetterOrValue<Getter extends Callable = Callable> = Getter | ReturnType<Getter>;

export type Computed<T extends object, Keys extends keyof T = never> = {
  [K in keyof T]: K extends Keys
    ? T[K] extends Callable
      ? ReturnType<T[K]>
      : T[K]
    : T[K];
};

export function compute<T extends object, Keys extends keyof T>(obj: T, keys: Keys[], context: any): Computed<T, Keys> {
  let computed = { ...obj };

  for (const [key, value] of Object.entries(obj)) {
    if (!keys.includes(<Keys> key)) continue;
    if (!isCallable(value)) continue;

    computed[key] = get(value, context);
  }

  return computed as Computed<T, Keys>;
}
