import { ParseError } from "~/tokens";
import { NumberRange } from "~/utils/range";

import { Parameter, type ParameterParseContext } from "./parameter";
import { white } from "@mhesus/mcbe-colors";

export class NumberParameter<Name extends string> extends Parameter<number, Name> {
  allowNaN = false;
  allowInf = false;
  range = new NumberRange({});

  parse({ tokens }: ParameterParseContext): number {
    const token = tokens.pop() ?? "";
    const value = parseFloat(token);

    if (Number.isNaN(value)) {
      if (!this.allowNaN) throw new ParseError(`Expected ${white(this.name)} to be a number`);
      return value;
    }

    if (!Number.isFinite(value) && !this.allowInf) {
      throw new ParseError(`Expected ${white(this.name)} to be a finite number`);
    }

    if (this.range?.min) {
      if (this.range.min.inclusive) {
        if (value < this.range.min.value) {
          throw new ParseError(
            `Expected ${white(this.name)} to be a number that is at least ${this.range.min.value}. You gave ${value}`,
          );
        }
      } else {
        if (value <= this.range.min.value) {
          throw new ParseError(
            `Expected ${white(this.name)} to be a number greater than ${this.range.min.value}. You gave ${value}`,
          );
        }
      }
    }

    if (this.range?.max) {
      if (this.range.max.inclusive) {
        if (value > this.range.max.value) {
          throw new ParseError(
            `Expected ${white(this.name)} to be a number that is at most ${this.range.max.value}. You gave ${value}`,
          );
        }
      } else {
        if (value >= this.range.max.value) {
          throw new ParseError(
            `Expected ${white(this.name)} to be a number less than ${this.range.max.value}. You gave ${value}`,
          );
        }
      }
    }

    if (!this.range?.contains(value)) {
    }

    return value;
  }
}
