import { ValueError } from "~/errors";
import type { ParameterParseTokenContext, ParameterParseValueContext } from "../parameter-parse-context";
import { Parameter, ParameterSignatureOptions } from "./parameter";

import { literal } from "~/tokens/parsers";

export class LiteralParameter<const Choices extends readonly string[] = readonly string[]> extends Parameter<
  Choices extends readonly [] ? unknown : Choices[number],
  string
> {
  choices: Choices;

  constructor(...choices: Choices) {
    super();
    this.choices = choices;
  }

  parseToken({ tokens }: ParameterParseTokenContext) {
    return tokens.pop(literal(...this.choices)) ?? "";
  }

  parseValue({ token }: ParameterParseValueContext<string>) {
    if (!this.choices.includes(token)) {
      throw new ValueError(`Expected one of the following: ${this.choices.join(", ")}`);
    }

    return token as Choices extends readonly [] ? unknown : Choices[number];
  }

  getSignature(options: ParameterSignatureOptions): string {
    const name = this.choices.join("|");

    if (!this.optional) return name;

    if (options?.showDefaultValue && this.optional.defaultValue) {
      return `[${name} = ${this.optional.defaultValue}]`;
    }

    return `[${name}]`;
  }
}
