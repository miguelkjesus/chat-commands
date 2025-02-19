import { ParseError } from "~/tokens";
import { NumberRange } from "~/utils/range";

import { Parameter, type ParameterParseContext } from "./parameter";

export class NumberParameter<Name extends string> extends Parameter<number, Name> {
  allowNaN = false;
  allowInf = false;
  range = new NumberRange({});

  parse({ tokens }: ParameterParseContext): number {
    const token = tokens.pop() ?? "";
    const value = parseFloat(token);

    if (Number.isNaN(value)) {
      if (!this.allowNaN) throw new ParseError(`Expected integer, got ${token}`);
      return value;
    }

    if (!Number.isFinite(value) && !this.allowInf) {
      throw new ParseError(`Expected finite integer, got ${token}`);
    }

    if (!this.range?.contains(value)) {
      throw new ParseError(`Expected number in range ${this.range}, got ${token}`);
    }

    return value;
  }
}
