import type { TokenSubstream } from "../stream";
import { Token, TokenParser } from "../token";

export class RemainingParser extends TokenParser<string> {
  parse(stream: TokenSubstream): Token<string> {
    return stream.token(stream.unparsed).length(stream.unparsed.length);
  }
}
