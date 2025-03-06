import { StringParameter } from "~/parameters";
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

  length(range: [number?, number?]): this;
  length(length: number): this;
  length(arg: [number?, number?] | number) {
    const range = typeof arg === "number" ? [arg, arg] : arg;

    if (range[0]) {
      this.__state.minLength = range[0];
    }

    if (range[1]) {
      this.__state.maxLength = range[1];
    }

    return this;
  }

  pattern(pattern: RegExp, failMessage?: string) {
    return this.__set({ pattern: { value: pattern, failMessage } });
  }
}
