import { Callable } from "./callable";

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
