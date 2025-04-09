import { TokenStreamError } from "./error-builder";
import { TokenParserResult } from "./parser";
import { TokenStream } from "./stream";

export class TokenSubstream extends TokenStream {
  readonly parent: TokenStream;

  constructor(parent: TokenStream, relativePosition = 0) {
    super(parent.input, parent.position + relativePosition);
    this.parent = parent;
  }

  get relativePosition() {
    return this.position - this.parent.position;
  }

  get error() {
    return new TokenStreamError(this);
  }

  result<T>(value: T, nextPosition = 0) {
    return new TokenParserResult<T>(value, this.position + nextPosition);
  }

  getCharRef(relativePosition = 0) {
    return new CharRef(this, relativePosition);
  }

  clone() {
    return new TokenSubstream(this.parent, this.relativePosition);
  }
}

export class CharRef {
  readonly stream: TokenStream;
  readonly absolutePosition: number;
  readonly char: string;

  constructor(stream: TokenStream, relativePosition = 0) {
    this.stream = stream;
    this.absolutePosition = stream.position + relativePosition;
    this.char = stream.input[this.absolutePosition];
  }

  get relativePosition() {
    return this.absolutePosition - this.stream.position;
  }
}
