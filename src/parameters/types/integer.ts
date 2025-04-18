import { IntegerParser } from "~/tokens";
import { IntegerRange } from "~/utils/integer-range";

import type { ParameterParseTokenContext, ParameterParseValueContext } from "../parameter-parse-context";
import { Parameter } from "./parameter";

export class IntegerParameter extends Parameter<number, number> {
  typeName = "integer";

  range = new IntegerRange({});

  parseToken({ stream }: ParameterParseTokenContext) {
    return stream.pop(new IntegerParser());
  }

  parseValue({ token }: ParameterParseValueContext<number>) {
    const { value } = token;

    if (Number.isNaN(value)) {
      throw token.error(`Expected a number`).state;
    }

    if (this.range.min && this.range.min > value) {
      throw token.error(`Expected a number that is at least ${this.range.min}`).state;
    }

    if (this.range.max && this.range.max < value) {
      throw token.error(`Expected a number that is at most ${this.range.max}`).state;
    }

    return value;
  }
}
