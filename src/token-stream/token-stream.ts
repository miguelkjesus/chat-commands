import { text as parseTextToken } from "./token-parsers";

export class TokenStream {
  unparsed: string;

  constructor(message: string) {
    this.unparsed = message;
  }

  pop(parse = parseTextToken): string | undefined {
    const { unparsed, token } = parse(this.unparsed);
    this.unparsed = unparsed;
    return token;
  }
}
