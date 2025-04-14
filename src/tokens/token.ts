import { Style } from "@mhesus/mcbe-colors";
import { TokenSubstream } from "./stream";

export abstract class TokenParser<T> {
  abstract parse(stream: TokenSubstream): Token<T>;

  toString() {
    return this.constructor.name;
  }
}

export class Token<T> {
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

  get text() {
    return this.stream.input.slice(this.startPosition, this.endPosition);
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

  resultSpan(result: Token<any>) {
    return this.span(result.startPosition - this.stream.position, result.endPosition - this.stream.position);
  }

  length(length: number) {
    this.endPosition = this.startPosition + length;

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

  map<U>(func: (value: T) => U) {
    const result = new Token(this.stream, func(this.value));
    result.startPosition = this.startPosition;
    result.endPosition = this.endPosition;
    result.nextStreamPosition = this.nextStreamPosition;
    return result;
  }

  error(message: string) {
    return this.stream.error(message).tokenSpan(this);
  }

  substream() {
    return this.stream.substream(this.startPosition - this.stream.position, this.endPosition - this.stream.position);
  }

  toString() {
    return `${this.stream.input.slice(0, this.startPosition)}${Style.white.bold("[")}${this.text}${Style.white.bold("]")}${this.stream.input.slice(this.endPosition)}`;
  }
}

export type TokenValueType<T> = T extends Token<infer U> ? U : never;
