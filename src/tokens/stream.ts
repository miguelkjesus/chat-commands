import { TokenParseErrorBuilder } from "~/builders";
import { ParseError, TokenParseError } from "~/errors";

import { Token, type TokenParser } from "./token";
import { CharRef } from "./char-ref";
import debug from "~/utils/debug";
import { Style } from "@mhesus/mcbe-colors";

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

  static depth = 0;

  peek<T>(parser: TokenParser<T>): Token<T> {
    this.skipWhitespace();

    const prefix = "  ".repeat(TokenStream.depth);

    TokenStream.depth++;
    debug.log(Style.orange(`${prefix}> ${parser}`));

    try {
      const token = parser.parse(this.substream());
      debug.log(Style.green(`${prefix}< ${token}`));

      return token;
    } catch (e) {
      if (!(e instanceof ParseError)) throw e;
      debug.log(Style.red(`${prefix}!! ${e.name}: ${e.message}`));
      throw e;
    } finally {
      TokenStream.depth--;
    }
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
    return new TokenParseErrorBuilder(new TokenParseError(message, this.position, this.input.length - 1, this));
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
      throw this.error("Expected whitespace.");
    }
  }

  *[Symbol.iterator](): IterableIterator<string> {
    let chr: string | undefined;
    while ((chr = this.popChar())) {
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
    return new CharRef(this, relativePosition);
  }

  clone() {
    return new TokenSubstream(this.parent, this.relativePosition, this.endPosition - this.parent.position);
  }
}
