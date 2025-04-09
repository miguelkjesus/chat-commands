import { TokenStream } from "~/tokens";
import { ParseError } from "./parse-error";

export class TokenParseError extends ParseError {
  name = "ParseError";

  readonly stream: TokenStream;
  startPosition = 0;
  endPosition: number;
  errorMessage!: string;

  constructor(stream: TokenStream) {
    super();
    this.stream = stream;
    this.endPosition = this.stream.input.length - 1;
  }

  get message() {
    return "TODO!"; // TODO Token stream error message
  }
}
