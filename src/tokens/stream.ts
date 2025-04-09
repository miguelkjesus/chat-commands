import { TokenParserResult, type TokenParser } from "./parser";
import { CharRef } from "./char-ref";
import { TokenParseErrorBuilder } from "~/builders";
import { TokenParseError } from "~/errors";

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
    this.position = result.nextStreamPosition;
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

export class TokenSubstream extends TokenStream {
  readonly parent: TokenStream;
  readonly initialPosition: number;

  constructor(parent: TokenStream, relativePosition = 0) {
    super(parent.input, parent.position + relativePosition);
    this.initialPosition = this.position;
    this.parent = parent;
  }

  get relativePosition() {
    return this.position - this.parent.position;
  }

  get error() {
    return new TokenParseErrorBuilder(new TokenParseError(this));
  }

  result<T>(value: T) {
    return new TokenParserResult<T>(this, value);
  }

  getCharRef(relativePosition = 0) {
    return new CharRef(this, relativePosition);
  }

  clone() {
    return new TokenSubstream(this.parent, this.relativePosition);
  }
}
