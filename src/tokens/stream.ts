import { type TokenParser, argument } from "./parsers";

export class TokenStream {
  unparsed: string;
  defaultParser: TokenParser = argument;

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

  popSome(count: number, parse?: TokenParser): string[] {
    const tokens: string[] = [];
    for (let i = 0; i < count; i++) {
      const token = this.pop(parse);
      if (token === undefined) break;
      tokens.push(token);
    }
    return tokens;
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
