import { TokenParser, Token } from "../token";
import type { TokenSubstream } from "../stream";

export class RegexParser extends TokenParser<string | null> {
  readonly regex: RegExp;

  constructor(regex: RegExp) {
    super();

    if (regex.global) {
      console.error("The global flag will have no effect.");
    }

    this.regex = regex;
  }

  parse(stream: TokenSubstream): Token<string | null> {
    const match = this.regex.exec(stream.unparsed);

    if (match === null) {
      return stream.token(null);
    }

    const str = match[0];
    const start = match.index;

    return stream.token(str).from(start).length(str.length);
  }

  toString(): string {
    return `RegexParser (${this.regex})`;
  }
}
