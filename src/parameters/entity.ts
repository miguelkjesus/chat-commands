// TODO:
//  - Introduce custom behaviours?
//    - dimension selectors
//    - allow lists for some selectors e.g. @a[tag=team_red, tag=team_blue]
//  - Introduce compatibility with java edition selectors?
//  -

import type { Entity } from "@minecraft/server";

import { parsers } from "~/tokens";

import { Parameter, type ParameterParseContext } from "./parameter";

export class EntityParameter<Name extends string> extends Parameter<Entity[], Name> {
  parse({ tokens, player }: ParameterParseContext): Entity[] {
    const selector = tokens.pop(parsers.targetSelector);

    if (typeof selector === "string") {
      return player.dimension.getPlayers({ name: selector });
    } else {
      return selector.execute(player);
    }
  }
}
