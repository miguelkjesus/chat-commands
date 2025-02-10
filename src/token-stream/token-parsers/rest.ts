import type { TokenParser } from "../token-parser";

export const text = function (unparsed: string) {
  return {
    unparsed: "",
    token: unparsed === "" ? undefined : unparsed,
  };
} satisfies TokenParser;
