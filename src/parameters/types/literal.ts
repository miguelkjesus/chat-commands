import { LiteralParser } from "~/tokens";
import type { ParameterParseTokenContext, ParameterParseValueContext } from "../parameter-parse-context";
import { Parameter } from "./parameter";

export class LiteralParameter<const Choices extends readonly string[] = readonly string[]> extends Parameter<
  Choices extends readonly [] ? string : Choices[number],
  string
> {
  choices: Choices;

  constructor(...choices: Choices) {
    super();
    this.choices = choices;
  }

  parseToken({ stream }: ParameterParseTokenContext) {
    return stream.pop(new LiteralParser(this.choices as readonly string[]));
  }

  parseValue({ token }: ParameterParseValueContext<string>) {
    return token.value as Choices extends readonly [] ? string : Choices[number];
  }

  getSignature(): string {
    const name = this.choices.join("|");

    if (!this.optional) return name;

    return `[${name}]`;
  }
}
