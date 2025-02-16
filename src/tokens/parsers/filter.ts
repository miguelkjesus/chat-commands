import { FilterCriteria, type Filter } from "~/utils/filter";
import { argument as parseArgument } from "./argument";
import { TokenParser } from "./parser";

export const filter = (brackets = "{}") => {
  return function (unparsed: string) {
    if (unparsed[0] !== brackets[0]) {
      throw new Error(`Expected ${brackets[0]}`);
    }

    // Get a list of the raw pairs: e.g. "{tag=sometag, m=survival}" -> ["tag=sometag", "m=survival"]

    let rawPairs = [""];
    let newUnparsed = "";
    let escape = false;

    for (let i = 1; i < unparsed.length; i++) {
      const ch = unparsed[i];

      if (escape) {
        rawPairs[rawPairs.length - 1] += ch;
        escape = false;
      } else if (ch === "\\") {
        escape = true;
      } else if (ch === ",") {
        rawPairs.push("");
      } else if (ch === brackets[1]) {
        newUnparsed = unparsed.slice(i + 1);
        break;
      } else {
        rawPairs[rawPairs.length - 1] += ch;
      }
    }

    // Parse the raw pairs into the key value pairs

    let filter: Filter = {};

    for (const rawPair of rawPairs) {
      const { key, exclude, value } = parsePair(rawPair);

      if (filter[key] === undefined) {
        filter[key] = new FilterCriteria();
      }

      if (exclude) {
        filter[key].exclude.push(value);
      } else {
        filter[key].include.push(value);
      }
    }

    return {
      unparsed: newUnparsed,
      token: filter,
    };
  } as TokenParser<Filter>;
};

function parsePair(pair: string): { key: string; exclude: boolean; value: string | Filter } {
  let key = "";

  // Parse key

  let i = 0;
  while (i < pair.length) {
    const ch = pair[i];

    if (ch === "=") {
      break;
    } else {
      key += ch;
    }

    i++;
  }

  // Check is a negation (is "key=!value" ?)

  let exclude = false;

  i++;
  if (pair[i] === "!") {
    exclude = true;
    i++;
  }

  // Parse value

  while (pair[i] === " ") i++;

  let parseResult = pair[i] === "{" ? filter("{}")(pair.slice(i)) : parseArgument(pair.slice(i));
  const value = parseResult.token;

  // is the rest not whitespace?
  if (!/^\s*$/.test(parseResult.unparsed)) {
    throw new Error("Expected value to end.");
  }

  return { key, exclude, value };
}
