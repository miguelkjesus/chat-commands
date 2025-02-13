import { type TokenParser, argument } from "./parsers";

export class TokenStream {
  unparsed: string;

  constructor(message: string) {
    this.unparsed = message;
  }

  peek(): string | undefined;
  peek<T>(parse: TokenParser<T>): T | undefined;
  peek<T>(parse?: TokenParser<T>): T | string | undefined {
    return (parse ?? (argument as TokenParser<T>))(this.unparsed).token;
  }

  pop(): string | undefined;
  pop<T>(parse: TokenParser<T>): T | undefined;
  pop<T>(parse?: TokenParser<T>): T | string | undefined {
    const { unparsed, token } = (parse ?? (argument as TokenParser<T>))(this.unparsed);
    this.unparsed = unparsed;
    return token;
  }

  popSome(count: number): string[];
  popSome<T>(count: number, parse: TokenParser<T>): T[];
  popSome<T>(count: number, parse?: TokenParser<T>): T[] | string[] {
    const tokens: T[] = [];
    for (let i = 0; i < count; i++) {
      const token = this.pop(parse);
      if (token === undefined) break;
      tokens.push(token);
    }
    return tokens;
  }

  flush(): Generator<string, void, unknown>;
  flush<T>(parse: TokenParser<T>): Generator<T, void, unknown>;
  *flush<T>(parse?: TokenParser<T>): Generator<T | string, void, unknown> {
    let token: T | string | undefined;
    while ((token = this.pop(parse))) yield token;
  }

  isEmpty() {
    return this.unparsed === "";
  }
}

export function tokenize<T>(message: string, parse: TokenParser<T>): T[] {
  return [...new TokenStream(message).flush(parse)];
}
