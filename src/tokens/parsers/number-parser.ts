import { TokenParser, Token } from "../token";
import type { TokenSubstream } from "../stream";

import { RegexParser } from "./regex-parser";
import { WordParser } from "./word-parser";

export class NumberParser extends TokenParser<number> {
  parse(stream: TokenSubstream): Token<number> {
    const matchFloat = /^[-+]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][-+]?\d+)?/;
    const token = stream.pop(new RegexParser(matchFloat));

    if (token.value === null) {
      const guessedToken = stream.pop(new WordParser());
      throw guessedToken.error("Expected a valid number.").toWordEnd().state;
    }

    const num = parseFloat(token.value);

    if (Number.isNaN(num)) {
      // This shouldn't happen but just in case
      throw token.error("Invalid number.").state;
    }

    return stream.token(num);
  }
}
