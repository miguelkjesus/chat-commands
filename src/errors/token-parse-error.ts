import { TokenStream, type Token } from "~/tokens";

import { ParseError } from "./parse-error";
import { Style } from "@mhesus/mcbe-colors";

export class TokenParseError extends ParseError {
  name = "TokenParseError";

  startPosition: number;
  endPosition: number;
  stream: TokenStream;

  constructor(message: string, startPosition: number, endPosition: number, stream: TokenStream) {
    super(message);
    this.startPosition = startPosition;
    this.endPosition = endPosition;
    this.stream = stream;
  }

  get errorLocationString() {
    const start = this.stream.input.slice(0, this.startPosition);
    const end = this.stream.input.slice(this.endPosition);
    const token = this.stream.input.slice(this.startPosition, this.endPosition);

    return `${start}${Style.red.bold(">>")} ${token} ${Style.red.bold("<<")}${end}`;
  }
}
