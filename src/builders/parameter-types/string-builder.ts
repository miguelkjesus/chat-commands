import { StringParameter } from "~/parameters/types";
import { ParameterBuilder } from "./parameter-builder";

export class StringParameterBuilder extends ParameterBuilder<StringParameter> {
  notEmpty(notEmpty: boolean) {
    this.state.notEmpty = notEmpty;
    return this;
  }

  minLength(minLength: number) {
    this.state.minLength = minLength;
    return this;
  }

  maxLength(maxLength: number) {
    this.state.maxLength = maxLength;
    return this;
  }

  length(range: [number?, number?]): this;
  length(length: number): this;
  length(arg: [number?, number?] | number) {
    const range = typeof arg === "number" ? [arg, arg] : arg;

    if (range[0]) {
      this.state.minLength = range[0];
    }

    if (range[1]) {
      this.state.maxLength = range[1];
    }

    return this;
  }

  pattern(pattern: RegExp, failMessage?: string) {
    this.state.pattern = { value: pattern, failMessage };
    return this;
  }
}
