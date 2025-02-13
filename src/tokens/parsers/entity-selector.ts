import type { TokenParser } from "./parser";

export const entitySelector = function (unparsed: string) {
  unparsed = unparsed.trimStart();
  if (!unparsed) return undefined;

  const quoteChars = ['"', "'"];

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
    } else if (ch === "@") {
      const selectorMatch = unparsed.slice(i).match(/^@[a-z]\[[^\]]*\]/);
      if (selectorMatch) {
        token += selectorMatch[0];
        newUnparsed = unparsed.slice(i + selectorMatch[0].length);
        break;
      } else {
        token += ch;
      }
      escape = true;
    } else if (quote) {
      if (ch === quote) {
        quote = undefined;
      } else {
        token += ch;
      }
    } else if (quoteChars.includes(ch)) {
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
