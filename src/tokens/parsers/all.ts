import type { TokenParser } from "./parser";

export const all = function (unparsed: string) {
  return {
    unparsed: "",
    token: unparsed === "" ? undefined : unparsed,
  };
} satisfies TokenParser;
