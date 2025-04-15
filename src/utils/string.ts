import type { Style } from "@mhesus/mcbe-colors";
import { distance } from "fastest-levenshtein";

function closestWithDistance(str: string, arr: readonly string[]) {
  // Code modified from https://github.com/ka-weihe/fastest-levenshtein/blob/29f25a1409e09d703caf6746fa9b3a3230607d91/mod.ts#L129

  let minDistance = Infinity;
  let minIndex = 0;

  for (let i = 0; i < arr.length; i++) {
    const dist = distance(str, arr[i]);
    if (dist < minDistance) {
      minDistance = dist;
      minIndex = i;
    }
  }

  return { closest: arr[minIndex], distance: minDistance };
}

export function getBestMatch(str: string, arr: readonly string[], threshold?: number) {
  const { closest, distance } = closestWithDistance(str, arr);

  if (distance <= (threshold ?? Math.ceil(str.length * 0.3))) {
    return closest;
  }
}

export function getBestPrefixMatch(str: string, prefixes: readonly string[], threshold?: number): string | undefined {
  if (!str || !prefixes.length) return undefined;

  let bestScore = -Infinity;
  let bestMatch: string | undefined;

  for (let i = 0; i < prefixes.length; i++) {
    const prefix = prefixes[i];
    const dist = distance(prefix, str.slice(0, prefix.length));

    if (dist >= (threshold ?? Math.ceil(prefix.length * 0.3))) continue;

    const score = prefix.length / (dist + 1);

    if (score > bestScore) {
      bestScore = score;
      bestMatch = prefix;
    }
  }

  return bestMatch;
}

export function getWordEndIndex(str: string, terminator = /\s/) {
  for (let i = 0; i < str.length; i++) {
    if (terminator.test(str[i])) {
      return i;
    }
  }
  return str.length;
}

export function formatOr(choices: readonly string[], highlight?: Style): string {
  let formatted = choices.map((choice) => highlight?.(choice) ?? choice);

  if (!formatted || formatted.length === 0) {
    return "";
  }

  if (formatted.length === 1) {
    return formatted[0];
  }

  if (formatted.length === 2) {
    return formatted[0] + " or " + formatted[1];
  }

  const lastItem = formatted.pop()!;
  return `${formatted.join(", ")}, or ${lastItem}`;
}

export function formatAnd(choices: readonly string[], highlight?: Style): string {
  let formatted = choices.map((choice) => highlight?.(choice) ?? choice);

  if (!formatted || formatted.length === 0) {
    return "";
  }

  if (formatted.length === 1) {
    return formatted[0];
  }

  if (formatted.length === 2) {
    return formatted[0] + " and " + formatted[1];
  }

  const lastItem = formatted.pop()!;
  return `${formatted.join(", ")}, and ${lastItem}`;
}

export function didYouMean(invalidOption: string, options: readonly string[], highlight?: Style) {
  const bestMatch = getBestMatch(invalidOption, options);
  return bestMatch ? ` Did you mean ${highlight?.(bestMatch) ?? bestMatch}?` : "";
}
