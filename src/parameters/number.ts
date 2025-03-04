import { NumberRange } from "~/utils/range";
import { ParseError } from "~/errors";

import type { ParameterParseContext } from "./parameter-parse-context";
import { Parameter } from "./parameter";

export class NumberParameter extends Parameter<number> {
  allowNaN = false;
  allowInf = false;
  range = new NumberRange({});

  parse({ tokens }: ParameterParseContext): number {
    const token = tokens.pop() ?? "";
    const value = parseFloat(token);

    if (Number.isNaN(value)) {
      if (!this.allowNaN) throw new ParseError(`Expected a number`);
      return value;
    }

    if (!Number.isFinite(value) && !this.allowInf) {
      throw new ParseError(`Expected a finite number`);
    }

    if (this.range?.min) {
      if (this.range.min.inclusive) {
        if (value < this.range.min.value) {
          throw new ParseError(`Expected a number that is at least ${this.range.min.value}`);
        }
      } else {
        if (value <= this.range.min.value) {
          throw new ParseError(`Expected a number greater than ${this.range.min.value}`);
        }
      }
    }

    if (this.range?.max) {
      if (this.range.max.inclusive) {
        if (value > this.range.max.value) {
          throw new ParseError(`Expected a number that is at most ${this.range.max.value}`);
        }
      } else {
        if (value >= this.range.max.value) {
          throw new ParseError(`Expected a number less than ${this.range.max.value}`);
        }
      }
    }

    if (!this.range?.contains(value)) {
    }

    return value;
  }
}
