import { Check, type Parameter, type ParameterType } from "~/parameters";
import { Builder } from "../builder";

export class ParameterBuilder<T extends Parameter = Parameter> extends Builder<T> {
  description(description: T["description"]) {
    return this.__set({ description } as Partial<T>);
  }

  optional(optional = true) {
    return this.__set({ optional: optional ? {} : undefined } as Partial<T>);
  }

  default(value: ParameterType<T>) {
    return this.__set({ optional: { defaultValue: value } } as Partial<T>);
  }

  check(callback: (value: ParameterType<T>) => boolean, errorMessage: string) {
    return this.__mutate(({ checks }) => checks.push(new Check(callback, errorMessage)));
  }
}
