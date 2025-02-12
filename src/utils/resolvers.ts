import { type Callable, isCallable } from "./types";

export function resolve<Resolver extends Callable>(
  resolver: Resolver | ReturnType<Resolver>,
  context: Parameters<Resolver>,
) {
  if (isCallable(resolver)) {
    return resolver(...context);
  }
  return resolver;
}

export type Resolvable<Resolver extends Callable = Callable> = Resolver | ReturnType<Resolver>;

export type Resolver<T extends Resolvable> = T extends Resolvable<infer R> ? R : never;

export type Resolved<T extends Resolvable> = ReturnType<Resolver<T>>;
