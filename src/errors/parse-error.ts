export class ParseError extends Error {
  name = "ParseError";

  constructor(message: string) {
    super(message);
  }
}
