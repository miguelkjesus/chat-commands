import { NumberRange } from "~/utils/number-range";
import { ValueError } from "~/errors";

import { IntegerParser } from "~/tokens";

import type {
  ParameterParseTokenContext,
  ParameterParseValueContext,
  ParameterValidateContext,
} from "../parameter-parse-context";
import { Parameter } from "./parameter";
import { IntegerRange } from "~/utils/integer-range";

export class IntegerParameter extends Parameter<number, number> {
  typeName = "integer";

  range = new IntegerRange({});

  parseToken({ stream }: ParameterParseTokenContext) {
    return stream.pop(new IntegerParser());
  }

  parseValue({ token }: ParameterParseValueContext<number>) {
    return token.value;
  }

  validate({ value }: ParameterValidateContext<number>): void {
    if (Number.isNaN(value)) {
      throw new ValueError(`Expected a number`);
    }

    if (this.range.min && this.range.min > value) {
      throw new ValueError(`Expected a number that is at least ${this.range.min}`);
    }

    if (this.range.max && this.range.max < value) {
      throw new ValueError(`Expected a number that is at most ${this.range.max}`);
    }
  }
}
