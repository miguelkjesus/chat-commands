import { TokenParserResult, type TokenParser } from "./parser";
import { TokenSubstream } from "./substream";

export class TokenStream {
  readonly input: string;
  position: number;

  constructor(input: string, position = 0) {
    this.input = input;
    this.position = position;
  }

  get unparsed() {
    return this.input.slice(this.position);
  }

  parse<T>(parser: TokenParser<T>): TokenParserResult<T> {
    const context = new TokenSubstream(this);
    return parser.parse(context);
  }

  peek<T>(parser: TokenParser<T>): T {
    return this.parse(parser).value;
  }

  pop<T>(parser: TokenParser<T>): T {
    const result = this.parse(parser);
    this.position = result.nextPosition;
    return result.value;
  }

  isEmpty() {
    return /^\s*$/.test(this.unparsed);
  }

  nextChar() {
    this.position++;
    return this.input[this.position];
  }

  *characters(): IterableIterator<string> {
    const first = this.input[this.position];
    if (first === undefined) return;

    yield first;
    while (this.position < this.input.length) {
      yield this.nextChar();
    }
  }

  clone() {
    return new TokenStream(this.unparsed);
  }
}
