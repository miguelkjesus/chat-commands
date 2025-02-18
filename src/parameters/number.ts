import { NumberRange } from "~/utils/range";

import { Parameter, type ParameterParseContext } from "./parameter";
import { ParameterParseError } from "./parse-error";

export class NumberParameter<Name extends string> extends Parameter<number, Name> {
  allowNaN = false;
  allowInf = false;
  range = new NumberRange({});

  parse({ tokens }: ParameterParseContext): number {
    const token = tokens.pop();
    if (token === undefined) {
      throw new ParameterParseError("Empt lol"); // TODO: error
    }

    const value = parseFloat(token);

    if (Number.isNaN(value)) {
      if (!this.allowNaN) throw new ParameterParseError(`Expected integer, got ${token}`);
      return value;
    }

    if (!Number.isFinite(value) && !this.allowInf) {
      throw new ParameterParseError(`Expected finite integer, got ${token}`);
    }

    if (!this.range?.contains(value)) {
      throw new ParameterParseError(`Expected number in range ${this.range}, got ${token}`);
    }

    return value;
  }
}
