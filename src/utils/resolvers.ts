import { type Callable, isCallable } from "./types";

export function resolve<Value, const Params extends any[]>(
  resolvable: Resolvable<(...params: Params) => Value>,
  params: Params,
) {
  if (isCallable(resolvable)) {
    return resolvable(...params);
  }
  return resolvable;
}

export type Resolvable<Resolver extends Callable = Callable> = Resolver | ReturnType<Resolver>;

export type Resolver<T extends Resolvable> = T extends Resolvable<infer R> ? R : never;

export type Resolved<T extends Resolvable> = ReturnType<Resolver<T>>;
