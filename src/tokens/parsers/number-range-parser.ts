import { NumberRange } from "~/utils/number-range";
import { ParseError } from "~/errors";

import { Token, TokenParser } from "../token";
import type { TokenSubstream } from "../stream";

import { NumberParser } from "./number-parser";
import { LiteralParser } from "./literal-parser";

export class NumberRangeParser extends TokenParser<NumberRange> {
  parse(stream: TokenSubstream): Token<NumberRange> {
    const minToken = stream.pop(new NumberParser());

    try {
      stream.pop(new LiteralParser([".."]));
    } catch (e) {
      if (!(e instanceof ParseError)) throw e;

      return minToken.map((value) => NumberRange.eq(value));
    }

    if (stream.isEmpty()) {
      throw stream.error("Expected a maximum value").at(0).state;
    }

    const maxToken = stream.pop(new NumberParser());

    return stream.token(NumberRange.inclusive(minToken.value, maxToken.value));
  }
}
