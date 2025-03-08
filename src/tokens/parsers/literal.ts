import { TokenParser } from "./parser";
import { argument } from "./argument";

export function literal(...choices: string[]): TokenParser<string | undefined> {
  return (unparsed: string) => {
    const matches = choices.filter((choice) => unparsed.startsWith(choice + " "));
    const longest = matches.reduce<string>((a, b) => (a.length > b.length ? a : b), "");

    if (longest) {
      return {
        unparsed: unparsed.slice(longest.length + 1),
        token: longest,
      };
    }

    return argument(unparsed);
  };
}
