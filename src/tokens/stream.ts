import { type TokenParser, TokenParserResult, argument } from "./parsers";

export class TokenStream {
  unparsed: string;

  constructor(message: string) {
    this.unparsed = message;
  }

  private runParser<T>(parse?: TokenParser<T>): TokenParserResult<T | string | undefined> {
    const { unparsed, token } = (parse ?? argument)(this.unparsed);
    return { unparsed: unparsed.trimStart(), token };
  }

  private applyParser<T>(parse?: TokenParser<T>): TokenParserResult<T | string | undefined> {
    const result = this.runParser(parse);
    this.unparsed = result.unparsed;
    return result;
  }

  peek(): string | undefined;
  peek<T>(parse: TokenParser<T>): T | undefined;
  peek<T>(parse?: TokenParser<T>): T | string | undefined {
    return this.runParser(parse).token;
  }

  pop(): string | undefined;
  pop<T>(parse: TokenParser<T>): T | undefined;
  pop<T>(parse?: TokenParser<T>): T | string | undefined {
    return this.applyParser(parse).token;
  }

  popSome(count: number): string[];
  popSome<T>(count: number, parse: TokenParser<T>): T[];
  popSome<T>(count: number, parse?: TokenParser<T>): T[] | string[] {
    const tokens: any[] = [];
    for (let i = 0; i < count; i++) {
      const token = this.applyParser(parse).token;
      if (token === undefined) break;
      tokens.push(token);
    }
    return tokens;
  }

  flush(): Generator<string, void, unknown>;
  flush<T>(parse: TokenParser<T>): Generator<T, void, unknown>;
  *flush<T>(parse?: TokenParser<T>): Generator<T | string, void, unknown> {
    let token: T | string | undefined;
    while ((token = this.pop(parse ?? (argument as TokenParser<T>)))) yield token;
  }

  isEmpty() {
    return /^\w+$/.test(this.unparsed);
  }

  clone() {
    return new TokenStream(this.unparsed);
  }
}

export function tokenize(message: string): string[];
export function tokenize<T>(message: string, parse: TokenParser<T>): T[];
export function tokenize<T>(message: string, parse?: TokenParser<T>): T[] {
  return [...new TokenStream(message).flush(parse ?? (argument as TokenParser<T>))];
}
