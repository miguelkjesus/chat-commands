export class ParameterParseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ParameterParseError";
  }
}
