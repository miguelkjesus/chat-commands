import { ValueError } from "~/errors";

import type { ParameterParseTokenContext, ParameterParseValueContext } from "../parameter-parse-context";
import { Parameter } from "./parameter";

export class LiteralParameter<const Choices extends readonly string[] = readonly string[]> extends Parameter<
  Choices extends readonly [] ? unknown : Choices[number],
  string
> {
  choices: Choices;

  constructor(...choices: Choices) {
    super();
    this.choices = choices;
  }

  parseToken({ tokens, parsers }: ParameterParseTokenContext) {
    return tokens.pop(parsers.literal(this.choices));
  }

  parseValue({ token }: ParameterParseValueContext<string>) {
    if (!this.choices.includes(token)) {
      if (this.choices.length > 1) {
        throw new ValueError(`Expected one of the following: ${this.choices.join(", ")}`);
      } else {
        throw new ValueError(`Expected: ${this.choices[0]}`);
      }
    }

    return token as Choices extends readonly [] ? unknown : Choices[number];
  }

  getSignature(): string {
    const name = this.choices.join("|");

    if (!this.optional) return name;

    return `[${name}]`;
  }
}
