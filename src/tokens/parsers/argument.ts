import type { TokenParser } from "./parser";

export const argument = function (unparsed: string) {
  unparsed = unparsed.trimStart();
  if (!unparsed) return undefined;

  let token = "";
  let newUnparsed = "";
  let quote = undefined;
  let escape = false;

  for (let i = 0; i < unparsed.length; i++) {
    const ch = unparsed[i];

    if (escape) {
      token += ch;
      escape = false;
    } else if (ch === "\\") {
      escape = true;
    } else if (quote) {
      if (ch === quote) {
        quote = undefined;
      } else {
        token += ch;
      }
    } else if (this.quoteChars.includes(ch)) {
      quote = ch;
    } else if (ch === " ") {
      newUnparsed = unparsed.slice(i + 1);
      break;
    } else {
      token += ch;
    }
  }

  return { token, unparsed: newUnparsed };
} satisfies TokenParser;
