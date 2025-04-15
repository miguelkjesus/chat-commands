import { getWordEndIndex } from "~/utils/string";

import { TokenParser, Token } from "../token";
import { TokenSubstream } from "../stream";

export class WordParser extends TokenParser<string> {
  readonly terminator?: RegExp;

  constructor(terminator?: RegExp) {
    super();
    this.terminator = terminator;
  }

  parse(stream: TokenSubstream): Token<string> {
    const wordEnd = getWordEndIndex(stream.unparsed, this.terminator);
    const word = stream.unparsed.slice(0, wordEnd);
    return stream.token(word).length(word.length);
  }
}
