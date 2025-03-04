/* 
TODO:

- Introduce custom behaviours?
  - dimension selectors
  - allow lists for selectors that currently dont e.g. @a[tag=team_red, tag=team_blue]
  - custom concise syntax? e.g. @a[tag=team_red | team_blue]
  - compatibility with java edition selectors?
*/

import type { Entity } from "@minecraft/server";

import { parsers } from "~/tokens";

import type { ParameterParseContext } from "./parameter-parse-context";
import { Parameter } from "./parameter";
import { ParseError } from "~/errors";

export class EntityParameter extends Parameter<Entity[]> {
  maxCount = Infinity;
  minCount = 0;

  parse({ tokens, player }: ParameterParseContext): Entity[] {
    const selector = tokens.pop(parsers.targetSelector);
    if (selector === undefined) return [];

    if (typeof selector === "string") {
      return player.dimension.getPlayers({ name: selector });
    } else {
      return selector.execute(player);
    }
  }

  validate(value: Entity[]) {
    super.validate(value);

    if (value.length < this.minCount) {
      throw new ParseError(`Too little entities! Expected at least ${this.minCount}`);
    }

    if (value.length > this.maxCount) {
      throw new ParseError(`Too many entities! Expected a string with a length of at most ${this.maxCount}`);
    }
  }
}
