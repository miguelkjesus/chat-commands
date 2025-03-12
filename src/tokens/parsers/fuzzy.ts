import { TokenParser } from "./parser";
import { fuzzyPrefixSearch } from "~/utils/string";

export function fuzzy(...choices: string[]): TokenParser<string | undefined> {
  return (unparsed: string) => {
    const bestMatch = fuzzyPrefixSearch(unparsed, choices);

    if (bestMatch) {
      return {
        unparsed: unparsed.slice(bestMatch.length + 1),
        token: bestMatch,
      };
    }

    return { unparsed, token: undefined };
  };
}
