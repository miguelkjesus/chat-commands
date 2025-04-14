import { EntityQueryOptions, GameMode, Vector3 } from "@minecraft/server";

import { type TargetSelectorType, TargetSelector } from "~/utils/target-selector";
import { NumberRange } from "~/utils/number-range";
import { Schema } from "~/utils/schema";
import { ParseError } from "~/errors";

import { Token, TokenParser } from "../token";
import type { TokenSubstream } from "../stream";

import { Filter, FilterCriteria, FilterFromSchema, FilterParser, SchemaFromFilterParser } from "./filter-parser";
import { StringParser } from "./string-parser";
import { TupleParser } from "./tuple-parser";

type TargetSelectorFilterParser = typeof TargetSelectorParser.targetSelectorFilterParser;
type TargetSelectorFilter = FilterFromSchema<SchemaFromFilterParser<TargetSelectorFilterParser>>;

export class TargetSelectorParser extends TokenParser<TargetSelector> {
  // keep up to date: https://wiki.bedrock.dev/commands/selectors#selector-arguments
  static readonly targetSelectorFilterParser = new FilterParser("[", "]", {
    type: "string",
    name: "string",
    family: "string",
    tag: "string",
    m: "string",
    c: "integer",
    l: "integer",
    lm: "integer",
    x: "number",
    y: "number",
    z: "number",
    dx: "number",
    dy: "number",
    dz: "number",
    r: "number",
    rm: "number",
    rx: "number",
    ry: "number",
    rxm: "number",
    rym: "number",
    scores: new FilterParser("{", "}", {
      [Schema.defaultType]: "integer-range",
    }),
    hasitem: new TupleParser({
      [Schema.defaultType]: new FilterParser("{", "}", {
        item: "string",
        location: "string",
        quantity: "integer",
        data: "integer",
        slot: "integer",
      }),
    }),
  });

  parse(stream: TokenSubstream): Token<TargetSelector> {
    // If its not a target selector, just parse it as a player name.
    if (stream.peekChar() !== "@") {
      return stream.pop(new StringParser()).map((name) => new TargetSelector("players", { name }));
    }

    const selectorTypeToken = this.parseTargetSelectorType(stream);
    const filterToken = this.parseTargetSelectorFilter(stream);
    const entityQueryOptionsToken = filterToken.map((filter) => this.filterToEntityQueryOptions(filter));

    return stream.token(new TargetSelector(selectorTypeToken.value, entityQueryOptionsToken.value));
  }

  parseTargetSelectorType(stream: TokenSubstream): Token<TargetSelectorType> {
    if (stream.popChar() !== "@") {
      throw stream.error("Expected '@' at the start of target selector type.").at(0).state;
    }

    const typeCode = stream.popChar();

    const selectorTypeMap = {
      e: "all",
      a: "players",
      p: "nearest-player",
      r: "random-player",
      s: "self",
    } satisfies Record<string, TargetSelectorType>;

    const type = typeCode ? selectorTypeMap[typeCode] : (undefined as TargetSelectorType | undefined);

    if (type === undefined) {
      throw stream.error(`Unknown entity selector type: @${typeCode}`).at(0).state;
    }

    return stream.token(type);
  }

  parseTargetSelectorFilter(stream: TokenSubstream) {
    if (stream.isEmpty()) {
      return stream.token({});
    }

    return stream.pop(TargetSelectorParser.targetSelectorFilterParser);
  }

  filterToEntityQueryOptions(filter: Filter): EntityQueryOptions {
    let query: EntityQueryOptions = {};
    let location: Partial<Vector3> = {};
    let volume: Partial<Vector3> = {};

    this.switchFilterCriteria(filter, {
      m: (criteria) => {
        const gamemodeMap = {
          "0": GameMode.survival,
          s: GameMode.survival,
          survival: GameMode.survival,

          "1": GameMode.creative,
          c: GameMode.creative,
          creative: GameMode.creative,

          "2": GameMode.adventure,
          a: GameMode.adventure,
          adventure: GameMode.adventure,

          spectator: GameMode.spectator,

          d: "default",
          default: "default",
        } as const;

        const includeGamemode = criteria.lastInclude ? gamemodeMap[criteria.lastInclude.value] : undefined;
        const excludeGamemodes = criteria.exclude.map((mode) => gamemodeMap[mode.value]);

        if ([includeGamemode, ...excludeGamemodes].includes(undefined)) {
          let badGamemode =
            includeGamemode === undefined
              ? criteria.lastInclude!
              : criteria.exclude[excludeGamemodes.indexOf(undefined)]!;

          throw badGamemode.error(`Unknown gamemode "${badGamemode.value}"`).state;
        }

        if ([includeGamemode, ...excludeGamemodes].includes("default")) {
          // TODO add support for default gamemodes

          let badGamemode =
            includeGamemode === "default"
              ? criteria.lastInclude!
              : criteria.exclude[excludeGamemodes.indexOf("default")]!;

          throw badGamemode.error(`"default" gamemode is not yet supported!`).state;
        }

        query.gameMode = includeGamemode;
        query.excludeGameModes = excludeGamemodes;
      },

      scores: (criteria) => {
        if (!criteria.lastInclude) return;

        query.scoreOptions = [];

        for (const [objective, scoreCriteria] of Object.entries(criteria.lastInclude.value)) {
          const { include, exclude } = scoreCriteria as FilterCriteria<Token<NumberRange>>;

          for (const range of include) {
            query.scoreOptions.push({
              objective,
              minScore: range.value.min?.value,
              maxScore: range.value.max?.value,
            });
          }

          for (const range of exclude) {
            query.scoreOptions.push({
              objective,
              minScore: range.value.min?.value,
              maxScore: range.value.max?.value,
              exclude: true,
            });
          }
        }
      },

      hasitem: (criteria) => {
        if (!criteria.lastInclude) return;

        // hasitem not supported by entity query options. Need to implement this manually.

        throw criteria.lastInclude.error("hasitem is not supported yet!").state;
      },

      type: (criteria) => {
        query.type = criteria.lastInclude?.value;
        query.excludeTypes = criteria.exclude.map((token) => token.value);
      },

      name: (criteria) => {
        query.name = criteria.lastInclude?.value;
        query.excludeNames = criteria.exclude.map((token) => token.value);
      },

      family: (criteria) => {
        query.families = criteria.include.map((token) => token.value);
        query.excludeFamilies = criteria.exclude.map((token) => token.value);
      },

      tag: (criteria) => {
        query.tags = criteria.include.map((token) => token.value);
        query.excludeTags = criteria.exclude.map((token) => token.value);
      },

      c: (criteria) => {
        query.closest = criteria.lastInclude?.value;
      },

      x: (criteria) => {
        location.x = criteria.lastInclude?.value;
      },

      y: (criteria) => {
        location.y = criteria.lastInclude?.value;
      },

      z: (criteria) => {
        location.z = criteria.lastInclude?.value;
      },

      dx: (criteria) => {
        volume.x = criteria.lastInclude?.value;
      },

      dy: (criteria) => {
        volume.y = criteria.lastInclude?.value;
      },

      dz: (criteria) => {
        volume.z = criteria.lastInclude?.value;
      },

      r: (criteria) => {
        query.maxDistance = criteria.lastInclude?.value;
      },

      rm: (criteria) => {
        query.minDistance = criteria.lastInclude?.value;
      },

      rx: (criteria) => {
        query.maxHorizontalRotation = criteria.lastInclude?.value;
      },

      ry: (criteria) => {
        query.maxVerticalRotation = criteria.lastInclude?.value;
      },

      rxm: (criteria) => {
        query.minHorizontalRotation = criteria.lastInclude?.value;
      },

      rym: (criteria) => {
        query.minVerticalRotation = criteria.lastInclude?.value;
      },

      l: (criteria) => {
        query.maxLevel = criteria.lastInclude?.value;
      },

      lm: (criteria) => {
        query.minLevel = criteria.lastInclude?.value;
      },
    });

    if (location.x && location.y && location.z) {
      query.location = location as Vector3;
    } else if (location.x || location.y || location.z) {
      throw new ParseError("Location must have all x, y and z coordinates.");
    }

    if (volume.x && volume.y && volume.z) {
      query.volume = volume as Vector3;
    } else if (volume.x || volume.y || volume.z) {
      throw new ParseError("Volume must have all x, y and z coordinates.");
    }

    return query;
  }

  switchFilterCriteria(
    filter: TargetSelectorFilter,
    cases: { [Key in keyof TargetSelectorFilter]: (criteria: Exclude<TargetSelectorFilter[Key], undefined>) => void },
  ) {
    for (const key of Object.keys(filter) as (keyof TargetSelectorFilter)[]) {
      const criteria = filter[key];

      if (criteria === undefined) continue;

      cases[key]?.(criteria as any);
    }
  }
}
