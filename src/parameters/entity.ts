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

import { Parameter, type ParameterParseContext } from "./parameter";

export class EntityParameter extends Parameter<Entity[]> {
  parse({ tokens, player }: ParameterParseContext): Entity[] {
    const selector = tokens.pop(parsers.targetSelector);
    if (selector === undefined) return [];

    if (typeof selector === "string") {
      return player.dimension.getPlayers({ name: selector });
    } else {
      return selector.execute(player);
    }
  }
}
