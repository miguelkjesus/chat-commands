import { TokenStream } from "./stream";

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
