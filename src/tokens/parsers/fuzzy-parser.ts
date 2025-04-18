import { getBestPrefixMatch } from "~/utils/string";

import type { TokenSubstream } from "../stream";
import { Token, TokenParser } from "../token";

export class FuzzyParser<Choices extends readonly string[] = readonly string[]> extends TokenParser<
  Choices[number] | undefined
> {
  readonly choices: Choices;

  constructor(choices: Choices) {
    super();
    this.choices = choices;
  }

  parse(stream: TokenSubstream): Token<Choices[number] | undefined> {
    const bestMatch = getBestPrefixMatch(stream.unparsed, this.choices);

    if (bestMatch) {
      return stream.token(bestMatch).length(bestMatch.length);
    }

    return stream.token(undefined);
  }
}
