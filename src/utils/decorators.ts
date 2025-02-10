import type { Callable } from "./types";

export type Bound<This, Func extends Callable> = (
  this: This,
  ...args: Parameters<Func>
) => ReturnType<Func>;

export function bound<This, T extends Callable>(
  accessor: ClassAccessorDecoratorTarget<This, T>
): ClassAccessorDecoratorResult<This, Bound<This, T>> {
  return {
    ...accessor,
    set(this: This, value: T) {
      if (typeof value === "function") {
        return value.bind(this);
      }

      return value;
    },
  };
}

export interface ConstantMethod<This, Args extends any[], Return> {
  (this: This, ...args: Args): Return;
  cache: Return;
}

export function computeOnce<This, Args extends any[], Return>(
  func: (this: This, ...args: Args) => Return
): ConstantMethod<This, Args, Return> {
  const memoized = function (this: This, ...args: Args): Return {
    if (memoized.cache) {
      return memoized.cache;
    }

    const value = func.call(this, ...args);
    memoized.cache = value;
    return value;
  } as ConstantMethod<This, Args, Return>;

  return memoized;
}
