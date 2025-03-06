import { ValueError } from "~/errors";

import { Parameter } from "./parameter";
import { ParameterParseTokenContext, ParameterParseValueContext } from "./parameter-parse-context";

// TODO: This shouldn't have all parameter things!
export class LiteralParameter extends Parameter<undefined> {
  parseToken({ tokens }: ParameterParseTokenContext) {
    return tokens.pop();
  }

  parseValue({ token }: ParameterParseValueContext<string>): undefined {
    if (token !== this.name) {
      throw new ValueError(`Expected "${this.name}"`);
    }
  }

  getSignature(): string {
    if (this.name === undefined) {
      throw new Error("Parameter has no name.");
    }

    return this.name;
  }
}
