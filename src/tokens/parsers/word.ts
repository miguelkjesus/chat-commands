import { TokenParser, TokenParserResult } from "../parser";
import { TokenSubstream } from "../stream";

export class WordParser implements TokenParser<string> {
  parse(stream: TokenSubstream): TokenParserResult<string> {
    const wordEnd = stream.unparsed.indexOf(" ") || stream.unparsed.length;
    const word = stream.unparsed.slice(0, wordEnd);
    return stream.result(word).length(wordEnd);
  }
}
