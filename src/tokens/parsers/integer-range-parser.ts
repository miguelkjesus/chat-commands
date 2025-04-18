import { ParseError } from "~/errors";
import { IntegerRange } from "~/utils/integer-range";

import type { TokenSubstream } from "../stream";
import { Token, TokenParser } from "../token";

import { IntegerParser } from "./integer-parser";
import { LiteralParser } from "./literal-parser";

export class IntegerRangeParser extends TokenParser<IntegerRange> {
  parse(stream: TokenSubstream): Token<IntegerRange> {
    const min = stream.pop(new IntegerParser());

    try {
      stream.pop(new LiteralParser([".."]));
    } catch (e) {
      if (!(e instanceof ParseError)) throw e;

      return min.map((value) => IntegerRange.eq(value));
    }

    if (stream.isEmpty()) {
      throw stream.error("Expected a maximum value").at(0).state;
    }

    const max = stream.pop(new IntegerParser());

    return stream.token(IntegerRange.range(min.value, max.value));
  }
}
