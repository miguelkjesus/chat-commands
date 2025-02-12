import { all } from "~/tokens/parsers";
import { Parameter, type ParameterParseContext } from "./parameter";
import { ParameterParseError } from "./parse-error";

export class StringParameter<Name extends string> extends Parameter<string, Name> {
  minLength = 0;
  maxLength = Infinity;
  pattern?: {
    value: RegExp;
    failMessage?: string;
  };

  parse({ tokens, params }: ParameterParseContext): string {
    const isLast = params.indexOf(this) === params.length - 1;
    const value = isLast ? tokens.pop(all) : tokens.pop();

    if (value.length < this.minLength)
      throw new ParameterParseError(`Expected string with length >= ${this.minLength}`);

    if (value.length > this.maxLength)
      throw new ParameterParseError(`Expected string with length <= ${this.maxLength}`);

    if (this.pattern && !this.pattern.value.test(value))
      throw new ParameterParseError(this.pattern.failMessage ?? `Expected string matching pattern ${this.pattern}`);

    return value;
  }
}
