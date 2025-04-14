import { TokenParser, Token } from "../token";
import type { TokenSubstream } from "../stream";

import { NumberParser } from "./number-parser";
import { RegexParser } from "./regex-parser";

export interface LocationComponentToken {
  type: "local" | "relative" | "absolute";
  value: number;
}

export class LocationComponentParser extends TokenParser<LocationComponentToken> {
  readonly component: string;

  constructor(component: string) {
    super();
    this.component = component;
  }

  parse(stream: TokenSubstream): Token<LocationComponentToken> {
    const matchLocationComponent = /^[~^]?[^\s~^]*/;
    const token = stream.pop(new RegexParser(matchLocationComponent));

    if (token === null) {
      throw stream.error("Invalid location coordinate.").toWordEnd().state;
    }

    const substream = token.substream();
    const prefix = substream.peekChar()!;

    if (["~", "^"].includes(prefix)) {
      substream.popChar();

      const value = !substream.isEmpty() ? substream.pop(new NumberParser()).value : 0;
      const type = prefix === "~" ? "relative" : "local";

      return token.map(() => ({ type, value }));
    } else {
      const value = substream.pop(new NumberParser()).value;
      return token.map(() => ({ type: "absolute", value }));
    }
  }
}
