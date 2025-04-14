import { NumberRange } from "~/utils/number-range";
import { ValueError } from "~/errors";

import { NumberParser } from "~/tokens";

import type {
  ParameterParseTokenContext,
  ParameterParseValueContext,
  ParameterValidateContext,
} from "../parameter-parse-context";
import { Parameter } from "./parameter";

export class NumberParameter extends Parameter<number, number> {
  typeName = "number";

  allowInf = false;
  range = new NumberRange({});

  parseToken({ stream }: ParameterParseTokenContext) {
    return stream.pop(new NumberParser());
  }

  parseValue({ token }: ParameterParseValueContext<number>) {
    return token.value;
  }

  validate({ value }: ParameterValidateContext<number>): void {
    if (Number.isNaN(value)) {
      throw new ValueError(`Expected a number`);
    }

    if (!Number.isFinite(value) && !this.allowInf) {
      throw new ValueError(`Expected a finite number`);
    }

    if (this.range.min) {
      if (this.range.min.inclusive) {
        if (value < this.range.min.value) {
          throw new ValueError(`Expected a number that is at least ${this.range.min.value}`);
        }
      } else {
        if (value <= this.range.min.value) {
          throw new ValueError(`Expected a number greater than ${this.range.min.value}`);
        }
      }
    }

    if (this.range.max) {
      if (this.range.max.inclusive) {
        if (value > this.range.max.value) {
          throw new ValueError(`Expected a number that is at most ${this.range.max.value}`);
        }
      } else {
        if (value >= this.range.max.value) {
          throw new ValueError(`Expected a number less than ${this.range.max.value}`);
        }
      }
    }
  }
}
