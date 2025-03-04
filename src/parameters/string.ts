import { all } from "~/tokens/parsers";

import { ParseError } from "~/errors";

import type { ParameterParseContext } from "./parameter-parse-context";
import { Parameter } from "./parameter";

export class StringParameter extends Parameter<string> {
  notEmpty = false;
  minLength = 0;
  maxLength = Infinity;
  pattern?: {
    value: RegExp;
    failMessage?: string;
  };

  parse({ tokens, params }: ParameterParseContext): string {
    const paramArray = Object.values(params);
    const isLast = paramArray.indexOf(this) === paramArray.length - 1;
    return (isLast ? tokens.pop(all) : tokens.pop()) ?? "";
  }

  validate(value: string) {
    super.validate(value);

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
  }
}

function regexToString(regex: RegExp) {
  return `/${regex.source}/${regex.flags}`;
}
