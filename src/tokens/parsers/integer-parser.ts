import { TokenParser, Token } from "../token";
import type { TokenSubstream } from "../stream";

import { RegexParser } from "./regex-parser";

export class IntegerParser extends TokenParser<number> {
  parse(stream: TokenSubstream): Token<number> {
    const matchInt = /^[+-]?\d+/;
    const token = stream.pop(new RegexParser(matchInt));

    if (token.value === null) {
      throw token.error("Invalid integer.").toWordEnd().state;
    }

    const int = parseFloat(token.value);

    if (Number.isNaN(int)) {
      // This shouldn't happen but just in case
      throw token.error("Invalid integer.").state;
    }

    return token.map(() => int);
  }
}
