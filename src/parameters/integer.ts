import { Parameter, ParameterParseContext } from "./parameter";

export class IntegerParameter extends Parameter<number> {
  acceptNaN = false;
  acceptInf = false;

  parse(ctx: ParameterParseContext): number {
    const token = ctx.stream.pop();
    const value = parseInt(token);

    if (Number.isNaN(value) && !this.acceptNaN) {
      throw new Error(`Expected integer, got ${token}`);
    }

    if (Number.isFinite(value) && !this.acceptInf) {
      throw new Error(`Expected finite integer, got ${token}`);
    }

    return value;
  }
}
