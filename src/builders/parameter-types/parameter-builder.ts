import { Check, LiteralParameter, type Parameter, type ParameterType } from "~/parameters";
import { Builder } from "../builder";
import { LiteralParameterBuilder } from "./literal-builder";

export class ParameterBuilder<T extends Parameter = Parameter> extends Builder<T> {
  name(name: string) {
    this.state.name = name;
    return this;
  }

  description(description: string) {
    this.state.description = description;
    return this;
  }

  optional(optional = true) {
    this.state.optional = optional ? {} : undefined;
    return this;
  }

  default(value: ParameterType<T>) {
    this.state.optional = { defaultValue: value };
    return this;
  }

  check(callback: (value: ParameterType<T>) => boolean, errorMessage: string) {
    this.state.checks.push(new Check(callback, errorMessage));
    return this;
  }
}

export type ParametersFromBuilders<T> = {
  [K in Extract<keyof T, string>]: T[K] extends ParameterBuilder<infer T>
    ? T extends LiteralParameter<[]>
      ? LiteralParameter<[K]>
      : T
    : never;
};

let a: ParametersFromBuilders<{ foo: LiteralParameterBuilder<readonly []> }>;
