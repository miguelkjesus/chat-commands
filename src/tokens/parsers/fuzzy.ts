import { fuzzyPrefixSearch } from "~/utils/string";

import { TokenParser, TokenParserResult } from "../parser";
import { TokenSubstream } from "../stream";

export class FuzzyParser<Choices extends readonly string[] = readonly string[]>
  implements TokenParser<Choices[number] | undefined>
{
  readonly choices: Choices;

  constructor(choices: Choices) {
    this.choices = choices;
  }

  parse(stream: TokenSubstream): TokenParserResult<Choices[number] | undefined> {
    const bestMatch = fuzzyPrefixSearch(stream.unparsed, this.choices);

    if (bestMatch) {
      return stream.result(bestMatch).length(bestMatch.length);
    }

    return stream.result(undefined);
  }
}
