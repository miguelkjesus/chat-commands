import { RemainingParser, StringParser } from "~/tokens";

import { Style } from "@mhesus/mcbe-colors";
import { formatOr } from "~/utils/string";
import type { ParameterParseTokenContext, ParameterParseValueContext } from "../parameter-parse-context";
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

  choices?: {
    values: readonly string[];
    failMessage?: string;
  };

  parseToken({ stream, params }: ParameterParseTokenContext) {
    const paramArray = Object.values(params);
    const isLast = paramArray.indexOf(this) === paramArray.length - 1;

    const parser = isLast ? new RemainingParser() : new StringParser();
    const token = stream.pop(parser);
    return token;
  }

  parseValue({ token }: ParameterParseValueContext<string>) {
    const { value } = token;

    if (this.notEmpty && value === "") {
      throw token.error(`Expected a non-empty string`).state;
    }

    if (this.minLength === this.maxLength && value.length !== this.minLength) {
      throw token.error(`Expected a string with a length of ${this.minLength}`).state;
    }

    if (value.length < this.minLength) {
      throw token.error(`String too short! Expected a length of at least ${this.minLength}`).state;
    }

    if (value.length > this.maxLength) {
      throw token.error(`String too long! Expected a length of at most ${this.maxLength}`).state;
    }

    if (this.pattern && !this.pattern.value.test(value)) {
      throw token.error(
        this.pattern.failMessage ?? `Expected a string matching the pattern ${regexToString(this.pattern.value)}`,
      ).state;
    }

    if (this.choices && !this.choices.values.includes(value)) {
      throw token.error(
        this.choices.failMessage ??
          `Expected one of the following values: ${formatOr(this.choices.values, Style.white)}`,
      ).state;
    }

    return value;
  }
}

function regexToString(regex: RegExp) {
  return `/${regex.source}/${regex.flags}`;
}
