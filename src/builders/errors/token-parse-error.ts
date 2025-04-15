import type { Token, TokenStream } from "~/tokens";
import type { TokenParseError } from "~/errors";
import { getWordEndIndex } from "~/utils/string";

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

  toWordEnd(terminator?: RegExp) {
    return this.to(getWordEndIndex(this.state.stream.unparsed, terminator));
  }

  span(relativeStartPosition: number, relativeEndPosition: number) {
    return this.from(relativeStartPosition).to(relativeEndPosition);
  }

  tokenSpan(result: Token<any>) {
    return this.span(
      result.startPosition - this.state.stream.position,
      result.endPosition - this.state.stream.position,
    );
  }
}
