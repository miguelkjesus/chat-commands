import type { TokenParser } from "./parsers/parser";
import { text as parseTextToken } from "./parsers";

export class TokenStream {
  unparsed: string;

  constructor(message: string) {
    this.unparsed = message;
  }

  pop(parse: TokenParser = parseTextToken): string | undefined {
    const { unparsed, token } = parse(this.unparsed);
    this.unparsed = unparsed;
    return token;
  }

  *flush(parse?: TokenParser): Iterator<string> {
    let token: string | undefined;
    while ((token = this.pop(parse))) yield token;
  }
}
