import { RemainingParser, StringParser } from "~/tokens";
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

  // TODO choices

  parseToken({ stream, params }: ParameterParseTokenContext) {
    const paramArray = Object.values(params);
    const isLast = paramArray.indexOf(this) === paramArray.length - 1;

    const parser = isLast ? new RemainingParser() : new StringParser();
    const token = stream.pop(parser);
    return token;
  }

  parseValue({ token }: ParameterParseValueContext<string>) {
    return token.value;
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
