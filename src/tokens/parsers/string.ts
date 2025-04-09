import type { TokenParser, TokenParserResult } from "../parser";
import type { TokenSubstream } from "../stream";
import type { CharRef } from "../char-ref";

export class StringParser implements TokenParser<string> {
  parse(stream: TokenSubstream): TokenParserResult<string> {
    const quoteChars = ['"', "'"];

    let relativeStartPosition = 0;

    let token = "";
    let quote: CharRef | undefined;
    let escape = false;

    for (const chr of stream.characters()) {
      if (escape) {
        token += chr;
        escape = false;
      } else if (chr === "\\") {
        escape = true;
      } else if (quote) {
        if (chr === quote.char) {
          quote = undefined;
          break;
        } else {
          token += chr;
        }
      } else if (quoteChars.includes(chr)) {
        relativeStartPosition++;
        quote = stream.getCharRef();
      } else if (chr === " ") {
        stream.position--;
        break;
      } else {
        token += chr;
      }
    }

    if (quote) {
      throw stream.error.expected("a closing quotation mark.").from(quote.relativePosition).state;
    }

    return stream.result(token).from(relativeStartPosition);
  }
}
