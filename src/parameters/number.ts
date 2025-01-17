import { Parameter, type ParameterParseContext } from "./parameter";
import { NumberRange } from "../utils/range";
import { ParseError } from "./parse-error";

export class NumberParameter extends Parameter<number> {
  allowNaN = false;
  allowInf = false;
  range = new NumberRange({});

  parse(ctx: ParameterParseContext): number {
    const token = ctx.stream.pop();
    const value = parseFloat(token);

    if (Number.isNaN(value)) {
      if (!this.allowNaN)
        throw new ParseError(`Expected integer, got ${token}`);
      return value;
    }

    if (Number.isFinite(value) && !this.allowInf) {
      throw new ParseError(`Expected finite integer, got ${token}`);
    }

    if (this.range?.contains(value)) {
      throw new ParseError(
        `Expected number in range ${this.range}, got ${token}`
      );
    }

    return value;
  }
}
