import { NumberRange } from "~/utils/number-range";
import { NumberParser } from "~/tokens";

import type { ParameterParseTokenContext, ParameterParseValueContext } from "../parameter-parse-context";
import { Parameter } from "./parameter";

export class NumberParameter extends Parameter<number, number> {
  typeName = "number";

  allowInf = false;
  range = new NumberRange({});

  parseToken({ stream }: ParameterParseTokenContext) {
    return stream.pop(new NumberParser());
  }

  parseValue({ token }: ParameterParseValueContext<number>) {
    const { value } = token;

    if (Number.isNaN(value)) {
      throw token.error(`Expected a number`).state;
    }

    if (!Number.isFinite(value) && !this.allowInf) {
      throw token.error(`Expected a finite number`).state;
    }

    if (this.range.min) {
      if (this.range.min.inclusive) {
        if (value < this.range.min.value) {
          throw token.error(`Expected a number that is at least ${this.range.min.value}`).state;
        }
      } else {
        if (value <= this.range.min.value) {
          throw token.error(`Expected a number greater than ${this.range.min.value}`).state;
        }
      }
    }

    if (this.range.max) {
      if (this.range.max.inclusive) {
        if (value > this.range.max.value) {
          throw token.error(`Expected a number that is at most ${this.range.max.value}`).state;
        }
      } else {
        if (value >= this.range.max.value) {
          throw token.error(`Expected a number less than ${this.range.max.value}`).state;
        }
      }
    }

    return value;
  }
}
