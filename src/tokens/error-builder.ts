import { TokenStream } from "./stream";

export class TokenStreamError extends Error {
  readonly stream: TokenStream;

  startPosition = 0;
  endPosition: number;

  errorMessage?: string;

  constructor(stream: TokenStream) {
    super();
    this.stream = stream;
    this.endPosition = this.stream.input.length - 1;
  }

  get message() {
    return "TODO!"; // TODO Token stream error message
  }

  at(relativePosition: number) {
    this.startPosition = this.stream.position + relativePosition;
    this.endPosition = this.stream.position + relativePosition;
    return this;
  }

  from(relativeStartPosition: number) {
    this.startPosition = this.stream.position + relativeStartPosition;
    return this;
  }

  to(relativeEndPosition: number) {
    this.endPosition = this.stream.position + relativeEndPosition;
    return this;
  }

  withMessage(message: string) {
    this.errorMessage = message;
    return this;
  }

  expected(message: string) {
    return this.withMessage(`Expected ${message}`);
  }

  unexpected(message: string) {
    return this.withMessage(`Unexpected ${message}`);
  }

  invalid(message: string) {
    return this.withMessage(`Invalid ${message}`);
  }
}
