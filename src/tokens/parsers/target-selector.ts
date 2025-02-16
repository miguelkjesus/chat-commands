import type { EntityQueryOptions, GameMode, Vector3 } from "@minecraft/server";
import { TargetSelector, TargetSelectorType } from "~/utils/target-selector";

import type { TokenParser } from "./parser";
import { argument as parseArgument } from "./argument";
import { filter as parseFilter } from "./filter";

export const targetSelector = function (unparsed: string) {
  if (!unparsed.startsWith("@")) {
    return parseArgument(unparsed);
  }

  const typeParseResult = parseSelectorType(unparsed);
  const type = typeParseResult.token;
  unparsed = typeParseResult.unparsed;

  const filterParseResult = parseQueryOptions(unparsed);
  const filter = filterParseResult.token;
  unparsed = typeParseResult.unparsed;

  return {
    unparsed,
    token: new TargetSelector(type, filter),
  };
} as TokenParser<TargetSelector | string>;

const parseSelectorType = function (unparsed: string) {
  unparsed = unparsed.trimStart();

  let escape = false;
  let selectorCode = "";
  let newUnparsed = "";

  for (let i = 1; i < unparsed.length; i++) {
    const ch = unparsed[i];

    if (escape) {
      selectorCode += ch;
      escape = false;
    } else if (ch === "\\") {
      escape = true;
    } else if (ch === " " || ch === "[") {
      newUnparsed = unparsed.slice(i + 1);
      break;
    } else {
      selectorCode += ch;
    }
  }

  const selectorTypeMap = {
    e: "all",
    a: "players",
    p: "nearest-player",
    r: "random-player",
    s: "self",
  } satisfies Record<string, TargetSelectorType>;

  const type = selectorTypeMap[selectorCode] as TargetSelectorType | undefined;

  if (type === undefined) {
    throw new Error(`Unknown entity selector type: @${selectorCode}`);
  }

  return {
    unparsed: newUnparsed,
    token: type,
  };
} satisfies TokenParser<TargetSelectorType | string>;

const parseQueryOptions = function (unparsed: string) {
  unparsed = unparsed.trimStart();

  if (!unparsed.startsWith("[")) {
    return { unparsed, token: {} };
  }

  const pairsParseResult = parseFilter("[]")(unparsed);
  const options = pairsParseResult.token;
  unparsed = pairsParseResult.unparsed;

  let query: EntityQueryOptions = {};
  let location: Partial<Vector3> = {};
  let volume: Partial<Vector3> = {};

  for (const [key, c /* criteria */] of Object.entries(options)) {
    switch (key) {
      case "type": {
        const { include, exclude } = c.assert("string").map({ include: "single" });
        query.type = include;
        query.excludeTypes = exclude;
        break;
      }

      case "name": {
        const { include, exclude } = c.assert("string").map({ include: "single" });
        query.name = include;
        query.excludeNames = exclude;
        break;
      }

      case "family": {
        const { include, exclude } = c.assert("string");
        query.families = include;
        query.excludeFamilies = exclude;
      }

      case "m": {
        const { include, exclude } = c.assert("string").map({ include: "single" });
        query.gameMode = include as GameMode;
        query.excludeGameModes = exclude as GameMode[];
        break;
      }

      case "scores": {
        const { include } = c.assert("filter").map({ include: "single" });

        // TODO: parse scores
      }

      case "c": {
        const { include } = c.assert("string").map({ include: "single" });
        query.closest = parseInt(include);
        break;
      }

      case "x": {
        const { include } = c.assert("string").map({ include: "single" });
        location.x = parseInt(include);
        break;
      }

      case "y": {
        const { include } = c.assert("string").map({ include: "single" });
        location.y = parseInt(include);
        break;
      }

      case "z": {
        const { include } = c.assert("string").map({ include: "single" });
        location.z = parseInt(include);
        break;
      }

      case "dx": {
        const { include } = c.assert("string").map({ include: "single" });
        volume.x = parseFloat(include);
        break;
      }

      case "dy": {
        const { include } = c.assert("string").map({ include: "single" });
        volume.y = parseFloat(include);
        break;
      }

      case "dz": {
        const { include } = c.assert("string").map({ include: "single" });
        volume.z = parseFloat(include);
        break;
      }

      case "r": {
        const { include } = c.assert("string").map({ include: "single" });
        query.maxDistance = parseFloat(include);
        break;
      }

      case "rm": {
        const { include } = c.assert("string").map({ include: "single" });
        query.minDistance = parseFloat(include);
        break;
      }

      case "rx": {
        const { include } = c.assert("string").map({ include: "single" });
        query.maxHorizontalRotation = parseFloat(include);
        break;
      }

      case "ry": {
        const { include } = c.assert("string").map({ include: "single" });
        query.maxVerticalRotation = parseFloat(include);
        break;
      }

      case "rxm": {
        const { include } = c.assert("string").map({ include: "single" });
        query.minHorizontalRotation = parseFloat(include);
        break;
      }

      case "rym": {
        const { include } = c.assert("string").map({ include: "single" });
        query.minVerticalRotation = parseFloat(include);
        break;
      }

      case "l": {
        const { include } = c.assert("string").map({ include: "single" });
        query.maxLevel = parseFloat(include);
        break;
      }

      case "lm": {
        const { include } = c.assert("string").map({ include: "single" });
        query.minLevel = parseFloat(include);
        break;
      }

      // TODO: hasitem

      default:
        throw new Error(`Unknown entity selector filter key: ${key}`);
    }
  }

  // TODO: errors for these
  query.location = location as Vector3;
  query.volume = volume as Vector3;

  return {
    unparsed,
    token: query,
  };
} satisfies TokenParser<EntityQueryOptions>;
