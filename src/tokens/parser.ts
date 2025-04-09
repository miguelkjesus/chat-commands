import type { TokenSubstream } from "./substream";

export class TokenParserResult<T> {
  value: T;
  nextPosition: number;

  constructor(value: T, nextPosition: number) {
    this.value = value;
    this.nextPosition = nextPosition;
  }
}

export interface TokenParser<T> {
  parse(stream: TokenSubstream): TokenParserResult<T>;
}
