import { TokenParser, TokenParserResult } from "../parser";
import { TokenSubstream } from "../stream";

export class LiteralParser<Choices extends readonly string[] = readonly string[]>
  implements TokenParser<Choices[number]>
{
  readonly choices: Choices;

  constructor(choices: Choices) {
    this.choices = choices;
  }

  parse(stream: TokenSubstream): TokenParserResult<Choices[number]> {
    const matches = this.choices.filter((choice) => stream.unparsed.startsWith(choice));
    const bestMatch = matches.reduce<string>((a, b) => (a.length > b.length ? a : b), "");

    if (bestMatch) {
      return stream.result(bestMatch).length(bestMatch.length);
    }

    const nextWordEnd = stream.unparsed.indexOf(" ") - 1 || stream.unparsed.length;
    throw stream.error.expected(`one of the following keywords: ${this.choices.join(", ")}.`).to(nextWordEnd).state;
  }
}
