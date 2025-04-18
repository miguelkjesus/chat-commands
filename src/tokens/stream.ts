import { TokenParseErrorBuilder } from "~/builders";
import { TokenParseError } from "~/errors";

import { CharRef } from "./char-ref";
import { Token, type TokenParser } from "./token";

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

  peek<T>(parser: TokenParser<T>): Token<T> {
    this.skipWhitespace();
    return parser.parse(this.substream());
  }

  apply(result: Token<any>) {
    this.position = result.nextStreamPosition;
  }

  pop<T>(parser: TokenParser<T>): Token<T> {
    const result = this.peek(parser);
    this.apply(result);
    return result;
  }

  error(message: string) {
    return new TokenParseErrorBuilder(new TokenParseError(message, this.position, this.input.length, this));
  }

  isEmpty() {
    return /^\s*$/.test(this.unparsed);
  }

  popChar(): string | undefined {
    let char = this.peekChar();
    if (char) {
      this.position++;
      return char;
    }
  }

  peekChar(): string | undefined {
    return this.input[this.position];
  }

  skipWhitespace() {
    for (const chr of this) {
      if (/\S/.test(chr)) {
        this.position--;
        break;
      }
    }
  }

  assertWhitespaceAndSkip() {
    let foundWhitespace = false;

    for (const chr of this) {
      if (/\s/.test(chr)) {
        foundWhitespace = true;
      } else {
        this.position--;
        break;
      }
    }

    if (!foundWhitespace && this.position < this.unparsed.length - 1) {
      throw this.error("Expected whitespace.").state;
    }
  }

  *[Symbol.iterator](): IterableIterator<string> {
    let chr: string | undefined;
    while ((chr = this.peekChar())) {
      this.position++;
      yield chr;
    }
  }

  substream(relativeStartPosition = 0, relativeEndPosition = this.unparsed.length) {
    return new TokenSubstream(this, relativeStartPosition, relativeEndPosition);
  }

  clone() {
    return new TokenStream(this.unparsed);
  }
}

export class TokenSubstream extends TokenStream {
  readonly parent: TokenStream;
  readonly initialPosition: number;

  endPosition: number;

  constructor(parent: TokenStream, relativePosition = 0, relativeEndPosition = parent.unparsed.length) {
    super(parent.input, parent.position + relativePosition);
    this.parent = parent;
    this.endPosition = parent.position + relativeEndPosition;

    this.initialPosition = this.position;
  }

  get unparsed() {
    return this.input.slice(this.position, this.endPosition);
  }

  peekChar() {
    if (this.position >= this.endPosition) return;
    return this.input[this.position];
  }

  get relativePosition() {
    return this.position - this.parent.position;
  }

  token<T>(value: T) {
    return new Token<T>(this, value);
  }

  getCharRef(relativePosition = 0) {
    return new CharRef(this, relativePosition - 1);
  }

  clone() {
    return new TokenSubstream(this.parent, this.relativePosition, this.endPosition - this.parent.position);
  }
}
