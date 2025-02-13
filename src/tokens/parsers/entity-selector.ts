import type { TokenParser } from "./parser";
import { argument } from "./argument";

export const entitySelector = function (unparsed: string) {
  if (!unparsed.startsWith("@")) {
    return argument(unparsed);
  }

  let inFilter = false;
  let escape = false;

  let token = "@";
  let newUnparsed = "";

  for (let i = 1; i < unparsed.length; i++) {
    const ch = unparsed[i];

    if (escape) {
      token += ch;
      escape = false;
    } else if (ch === "\\") {
      escape = true;
    } else if (ch === "[") {
      inFilter = true;
    } else if (ch === "]") {
      inFilter = false;
    } else if (ch === " " && !inFilter) {
      newUnparsed = unparsed.slice(i + 1);
      break;
    } else {
      token += ch;
    }
  }

  return { token, unparsed: newUnparsed };
} satisfies TokenParser;
