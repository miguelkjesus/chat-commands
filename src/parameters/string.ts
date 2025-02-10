import { all } from "~/tokens/parsers";
import { Parameter, type ParameterParseContext } from "./parameter";

export class StringParameter extends Parameter<string> {
  parse({ tokens, params }: ParameterParseContext): string {
    const isLast = params.indexOf(this) === params.length - 1;
    if (isLast) {
      return tokens.pop(all);
    }
    return tokens.pop();
  }
}
