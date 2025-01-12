import { GetterOrValue } from "./getters";

export interface Parameter<T> {
  name: string;
  type: ParameterType<T>;
  description: string;
  checks: [GetterOrValue<(value: T) => boolean>];
}

export interface ParameterType<T> {
  parse(): T;
  toString(): string;
}
