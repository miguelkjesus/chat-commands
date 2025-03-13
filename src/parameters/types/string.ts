import { all } from "~/tokens/parsers";
import { ValueError } from "~/errors";

import type {
  ParameterParseTokenContext,
  ParameterParseValueContext,
  ParameterValidateContext,
} from "../parameter-parse-context";
import { Parameter } from "./parameter";

export class StringParameter extends Parameter<string, string> {
  typeName = "string";

  notEmpty = false;
  minLength = 0;
  maxLength = Infinity;
  pattern?: {
    value: RegExp;
    failMessage?: string;
  };

  parseToken({ tokens, params }: ParameterParseTokenContext) {
    const paramArray = Object.values(params);
    const isLast = paramArray.indexOf(this) === paramArray.length - 1;
    return isLast ? tokens.pop(all) : tokens.pop();
  }

  parseValue({ token }: ParameterParseValueContext<string>): string {
    return token;
  }

  validate({ value }: ParameterValidateContext<string>) {
    if (this.notEmpty && value === "") {
      throw new ValueError(`Expected a non-empty string`);
    }

    if (this.minLength === this.maxLength && value.length !== this.minLength) {
      throw new ValueError(`Expected a string with a length of ${this.minLength}`);
    }

    if (value.length < this.minLength) {
      throw new ValueError(`String too short! Expected a length of at least ${this.minLength}`);
    }

    if (value.length > this.maxLength) {
      throw new ValueError(`String too long! Expected a length of at most ${this.maxLength}`);
    }

    if (this.pattern && !this.pattern.value.test(value)) {
      throw new ValueError(
        this.pattern.failMessage ?? `Expected a string matching the pattern ${regexToString(this.pattern.value)}`,
      );
    }
  }
}

function regexToString(regex: RegExp) {
  return `/${regex.source}/${regex.flags}`;
}
