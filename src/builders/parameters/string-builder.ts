import { StringParameter } from "~/parameters";
import { ParameterBuilder } from "./parameter-builder";

export class StringParameterBuilder extends ParameterBuilder<StringParameter> {
  notEmpty() {
    return this.__transform(({ minLength }) => {
      if (minLength === undefined || minLength < 1) {
        return { minLength: 1 };
      }
    });
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
