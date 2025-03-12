import { TokenParser } from "./parser";

export function literal(...choices: string[]): TokenParser<string | undefined> {
  return (unparsed: string) => {
    const matches = choices.filter((choice) => unparsed.startsWith(choice));
    const bestMatch = matches.reduce<string>((a, b) => (a.length > b.length ? a : b), "");

    if (bestMatch) {
      return {
        unparsed: unparsed.slice(bestMatch.length + 1),
        token: bestMatch,
      };
    }

    return { unparsed, token: undefined };
  };
}
