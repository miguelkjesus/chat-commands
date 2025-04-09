import { TokenParseError } from "~/errors";
import { Builder } from "../builder";

export class TokenParseErrorBuilder extends Builder<TokenParseError> {
  at(relativePosition: number) {
    this.state.startPosition = this.state.stream.position + relativePosition;
    this.state.endPosition = this.state.stream.position + relativePosition;
    return this;
  }

  from(relativeStartPosition: number) {
    this.state.startPosition = this.state.stream.position + relativeStartPosition;
    return this;
  }

  to(relativeEndPosition: number) {
    this.state.endPosition = this.state.stream.position + relativeEndPosition;
    return this;
  }

  span(relativeStartPosition: number, relativeEndPosition: number) {
    return this.from(relativeStartPosition).to(relativeEndPosition);
  }

  withMessage(message: string) {
    this.state.errorMessage = message;
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
