import { type TokenParser, text } from "./parsers";

export class TokenStream {
  unparsed: string;
  defaultParser: TokenParser = text;

  constructor(message: string) {
    this.unparsed = message;
  }

  peek(parse = this.defaultParser): string | undefined {
    return parse(this.unparsed).token;
  }

  pop(parse = this.defaultParser): string | undefined {
    const { unparsed, token } = parse(this.unparsed);
    this.unparsed = unparsed;
    return token;
  }

  *flush(parse = this.defaultParser): Generator<string, void, unknown> {
    let token: string | undefined;
    while ((token = this.pop(parse))) yield token;
  }

  isEmpty() {
    return this.unparsed === "";
  }
}

export function tokenize(message: string, parse?: TokenParser): string[] {
  return [...new TokenStream(message).flush(parse)];
}
