import { isCallable } from "./types";

export function resolve<Value, Params extends readonly any[]>(
  resolvable: CallbackOrValue<Value, [...Params]>,
  params: Params,
) {
  if (isCallable(resolvable)) {
    return resolvable(...params);
  }
  return resolvable;
}

export type CallbackOrValue<Value = any, CallbackParams extends readonly any[] = readonly any[]> =
  | ((...args: CallbackParams) => Value)
  | Value;

export type CallbackOf<T extends CallbackOrValue> = T extends CallbackOrValue<any, infer C> ? C : never;

export type ValueOf<T extends CallbackOrValue> = T extends CallbackOrValue<infer V> ? V : never;
