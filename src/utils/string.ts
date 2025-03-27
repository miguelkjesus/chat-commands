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

export function fuzzySearch(str: string, arr: readonly string[], threshold?: number) {
  const { closest, distance } = closestWithDistance(str, arr);

  if (distance <= (threshold ?? Math.ceil(str.length * 0.3))) {
    return closest;
  }
}

export function fuzzyPrefixSearch(str: string, prefixes: readonly string[], threshold?: number): string | undefined {
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
