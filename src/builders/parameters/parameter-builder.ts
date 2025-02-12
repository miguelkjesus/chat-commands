import type { Parameter } from "~/parameters";
import { Builder } from "../builder";

export class ParameterBuilder<T extends Parameter> extends Builder<T> {
  description(description: Parameter["description"]) {
    return this.__set({ description } as Partial<T>);
  }

  optional(optional: boolean) {
    return this.__set({ optional: optional ? {} : undefined } as Partial<T>);
  }

  defaultValue(defaultValue: T["optional"]["defaultValue"]) {
    return this.__set({ optional: { defaultValue } } as Partial<T>);
  }
}
