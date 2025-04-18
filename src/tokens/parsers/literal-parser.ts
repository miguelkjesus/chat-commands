import { didYouMean, formatOr } from "~/utils/string";

import { TokenParser, Token } from "../token";
import type { TokenSubstream } from "../stream";
import { Style } from "@mhesus/mcbe-colors";

export class LiteralParser<Choices extends readonly string[] = readonly string[]> extends TokenParser<Choices[number]> {
  readonly choices: Choices;
  readonly errorMessage?: string;

  constructor(choices: Choices, errorMessage?: string) {
    super();
    this.choices = choices;
    this.errorMessage = errorMessage;
  }

  parse(stream: TokenSubstream): Token<Choices[number]> {
    const matches = this.choices.filter((choice) => stream.unparsed.startsWith(choice));
    const bestMatch = matches.reduce<string>((a, b) => (a.length > b.length ? a : b), "");

    if (bestMatch) {
      return stream.token(bestMatch).length(bestMatch.length);
    }

    if (this.errorMessage) {
      throw stream.error(this.errorMessage).toWordEnd().state;
    }

    if (this.choices.length === 1) {
      throw stream.error(`Expected ${this.choices[0]}`).toWordEnd().state;
    } else {
      throw stream.error(`Expected either ${formatOr(this.choices, Style.white)}.`).toWordEnd().state;
    }
  }

  toString(): string {
    return `LiteralParser (${this.choices.map((choice) => `"${choice}"`).join(", ")})`;
  }
}
