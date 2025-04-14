import { TokenParser, Token } from "../token";
import type { TokenSubstream } from "../stream";
import type { CharRef } from "../char-ref";

export interface StringParserOptions {
  terminator?: RegExp;
  quoteCharacters?: string[];
}

export class StringParser extends TokenParser<string> {
  readonly stringTerminator = /\s/;
  readonly quoteCharacters = ['"', "'"];

  constructor(options: StringParserOptions = {}) {
    super();

    if (options.terminator) {
      this.stringTerminator = options.terminator;
    }
    if (options.quoteCharacters) {
      this.quoteCharacters = options.quoteCharacters;
    }
  }

  parse(stream: TokenSubstream): Token<string> {
    let token = "";
    let quote: CharRef | undefined;
    let escape = false;

    for (const chr of stream) {
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
      } else if (this.quoteCharacters.includes(chr)) {
        quote = stream.getCharRef();
      } else if (this.stringTerminator.test(chr)) {
        stream.position--;
        break;
      } else {
        token += chr;
      }
    }

    if (quote) {
      throw stream.error("Expected a closing quotation mark.").from(quote.relativePosition).state;
    }

    return stream.token(token);
  }
}
