import { getWordEndIndex } from "~/utils/string";

import { TokenParser, Token } from "../token";
import { TokenSubstream } from "../stream";

export class WordParser extends TokenParser<string> {
  parse(stream: TokenSubstream): Token<string> {
    const wordEnd = getWordEndIndex(stream.unparsed);
    const word = stream.unparsed.slice(0, wordEnd);
    return stream.token(word).length(word.length);
  }
}
