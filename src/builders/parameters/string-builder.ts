import type { StringParameter } from "~/parameters";
import { ParameterBuilder } from "./parameter-builder";

export class StringParameterBuilder<Name extends string> extends ParameterBuilder<StringParameter<Name>> {
  notEmpty() {
    if (this.__state.minLength === undefined || this.__state.minLength < 1) {
      return this.minLength(1);
    }
    return this;
  }

  minLength(minLength: number) {
    return this.__set({ minLength });
  }

  maxLength(maxLength: number) {
    return this.__set({ maxLength });
  }

  pattern(pattern: RegExp, failMessage?: string) {
    return this.__set({ pattern: { value: pattern, failMessage } });
  }
}
