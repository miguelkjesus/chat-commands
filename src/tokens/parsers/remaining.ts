import type { TokenParser, TokenParserResult } from "../parser";
import { TokenSubstream } from "../stream";

export class RemainingParser implements TokenParser<string> {
  parse(stream: TokenSubstream): TokenParserResult<string> {
    return stream.result(stream.unparsed).length(stream.unparsed.length);
  }
}
