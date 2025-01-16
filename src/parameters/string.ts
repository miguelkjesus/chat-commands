import { Parameter, ParameterParseContext } from "./parameter";

export class StringParameter extends Parameter<string> {
  parse(ctx: ParameterParseContext): string {
    const isLast = ctx.params.indexOf(this) === ctx.params.length - 1;
    if (isLast) {
      return ctx.stream.flush();
    }
    return ctx.stream.pop();
  }
}
