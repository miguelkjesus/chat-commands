import { all } from "~/tokens/parsers";
import { ParseError } from "~/tokens";

import { Parameter, type ParameterParseContext } from "./parameter";

export class StringParameter extends Parameter<string> {
  notEmpty = false;
  minLength = 0;
  maxLength = Infinity;
  pattern?: {
    value: RegExp;
    failMessage?: string;
  };

  parse({ tokens, params }: ParameterParseContext): string {
    const isLast = params.indexOf(this) === params.length - 1;
    const value = (isLast ? tokens.pop(all) : tokens.pop()) ?? "";

    if (this.notEmpty && value === "") {
      throw new ParseError(`Expected a non-empty string`);
    }

    if (value.length < this.minLength) {
      throw new ParseError(`Expected a string with a length of at least ${this.minLength}`);
    }

    if (value.length > this.maxLength) {
      throw new ParseError(`Expected a string with a length of at most ${this.maxLength}`);
    }

    if (this.pattern && !this.pattern.value.test(value)) {
      throw new ParseError(
        this.pattern.failMessage ?? `Expected a string matching the pattern ${regexToString(this.pattern.value)}`,
      );
    }

    return value;
  }
}

function regexToString(regex: RegExp) {
  return `/${regex.source}/${regex.flags}`;
}
