import type { StringParameter } from "~/parameters";
import { ParameterBuilder } from "./parameter-builder";

export class StringParameterBuilder extends ParameterBuilder<StringParameter> {
  notEmpty(notEmpty: boolean) {
    return this.__set({ notEmpty });
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
