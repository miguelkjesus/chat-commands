import { all } from "~/tokens/parsers";
import { Parameter, type ParameterParseContext } from "./parameter";
import { ParameterParseError } from "./parse-error";

export class StringParameter extends Parameter<string> {
  minLength = 0;
  maxLength = Infinity;
  pattern?: RegExp;

  parse({ tokens, params }: ParameterParseContext): string {
    const isLast = params.indexOf(this) === params.length - 1;
    const value = isLast ? tokens.pop(all) : tokens.pop();

    if (value.length < this.minLength)
      throw new ParameterParseError(
        `Expected string with length >= ${this.minLength}`
      );

    if (value.length > this.maxLength)
      throw new ParameterParseError(
        `Expected string with length <= ${this.maxLength}`
      );

    if (this.pattern && !this.pattern.test(value)) {
      throw new ParameterParseError(
        `Expected string matching pattern ${this.pattern}` // TODO: custom error messages for patterns
      );
    }

    return value;
  }
}
