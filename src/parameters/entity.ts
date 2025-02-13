// TODO:
//  - Introduce custom behaviours?
//    - dimension selectors
//    - allow lists for some selectors e.g. @a[tag=team_red, tag=team_blue]
//  - Introduce compatibility with java edition selectors?
//  -

import { type Entity, type EntityQueryOptions, Player } from "@minecraft/server";
import { Parameter, type ParameterParseContext } from "./parameter";
import { parsers } from "~/tokens";

export class EntityParameter<Name extends string> extends Parameter<Entity[], Name> {
  parse({ tokens, player }: ParameterParseContext): Entity[] {
    const token = tokens.pop(parsers.entitySelector);

    if (token.startsWith("@")) {
      const selector = parseSelector(token);
      return executeSelector(selector, player);
    }

    return player.dimension.getPlayers({ name: token });
  }
}

function executeSelector({ type, filter }: EntitySelector, player: Player): Entity[] {
  // Selector filters & modifiers

  if (type === "self") {
    return [player];
  }

  if (type === "nearest-player") {
    filter.closest = 1;
    type = "players";
  }

  // Search filters

  let search = player.dimension.getEntities(filter);

  if (type === "players") {
    search = search.filter((entity) => entity instanceof Player);
  }

  return search;
}

function parseSelector(selector: string): EntitySelector {
  // TODO: implement
  return;
}

interface EntitySelector {
  type: "all" | "players" | "nearest-player" | "random-player" | "self";
  filter: EntityQueryOptions;
}
