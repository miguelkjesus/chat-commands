import { TokenParser, Token } from "../token";
import type { TokenSubstream } from "../stream";
import debug from "~/utils/debug";

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
      throw stream.error(`Expected "${this.choices[0]}"`).toWordEnd().state;
    } else {
      throw stream.error(`Expected either: ${formatChoices(this.choices)}.`).toWordEnd().state;
    }
  }

  toString(): string {
    return `LiteralParser (${this.choices.map((choice) => `"${choice}"`).join(", ")})`;
  }
}

function formatChoices(choices: readonly string[]): string {
  let formatted = choices.map((choice) => `"${choice}"`);

  if (!formatted || formatted.length === 0) {
    return "";
  }

  if (formatted.length === 1) {
    return formatted[0];
  }

  if (formatted.length === 2) {
    return formatted[0] + " or " + formatted[1];
  }

  const lastItem = formatted.pop()!;
  return `${formatted.join(", ")}, or ${lastItem}`;
}
