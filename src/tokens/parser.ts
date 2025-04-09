import { TokenSubstream } from "./stream";

export interface TokenParser<T> {
  parse(stream: TokenSubstream): TokenParserResult<T>;
}

export class TokenParserResult<T> {
  readonly stream: TokenSubstream;
  readonly value: T;

  startPosition: number;
  endPosition: number;
  nextStreamPosition: number;

  private isNextStreamPositionExplicitlySet = false;

  constructor(stream: TokenSubstream, value: T) {
    this.stream = stream;
    this.value = value;

    this.startPosition = stream.initialPosition;
    this.endPosition = stream.position;
    this.nextStreamPosition = stream.position;
  }

  from(relativeStartPosition: number) {
    this.startPosition = this.stream.position + relativeStartPosition;
    return this;
  }

  to(relativeEndPosition: number) {
    this.endPosition = this.stream.position + relativeEndPosition;

    if (!this.isNextStreamPositionExplicitlySet) {
      this.nextStreamPosition = this.endPosition;
    }

    return this;
  }

  span(relativeStartPosition: number, relativeEndPosition: number) {
    return this.from(relativeStartPosition).to(relativeEndPosition);
  }

  length(length: number) {
    this.endPosition = this.startPosition + length - 1;

    if (!this.isNextStreamPositionExplicitlySet) {
      this.nextStreamPosition = this.endPosition;
    }

    return this;
  }

  nextPosition(relativeNextStreamPosition: number) {
    this.nextStreamPosition = this.stream.position + relativeNextStreamPosition;
    this.isNextStreamPositionExplicitlySet = true;
    return this;
  }
}
