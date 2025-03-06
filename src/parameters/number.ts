import { NumberRange } from "~/utils/range";
import { ParseError, ValueError } from "~/errors";

import type {
  ParameterParseTokenContext,
  ParameterParseValueContext,
  ParameterValidateContext,
} from "./parameter-parse-context";
import { Parameter } from "./parameter";

export class NumberParameter extends Parameter<number> {
  typeName = "number";

  allowNaN = false;
  allowInf = false;
  range = new NumberRange({});

  parseToken({ tokens }: ParameterParseTokenContext) {
    return tokens.pop();
  }

  parseValue({ token }: ParameterParseValueContext<string>) {
    return parseFloat(token);
  }

  validate({ value }: ParameterValidateContext<number>): void {
    if (Number.isNaN(value)) {
      if (!this.allowNaN) throw new ValueError(`Expected a number`);
    }

    if (!Number.isFinite(value) && !this.allowInf) {
      throw new ValueError(`Expected a finite number`);
    }

    if (this.range?.min) {
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

    if (this.range?.max) {
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
