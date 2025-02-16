import { type Entity, type EntityQueryOptions, Player } from "@minecraft/server";

export type TargetSelectorType = "all" | "players" | "nearest-player" | "random-player" | "self";

export class TargetSelector {
  type: TargetSelectorType;
  filter: EntityQueryOptions;

  constructor(type: TargetSelectorType, filter: EntityQueryOptions) {
    this.type = type;
    this.filter = filter;
  }

  execute(player: Player): Entity[] {
    let { type, filter } = this;

    // Selector filters & modifiers

    if (type === "self") {
      return [player];
    }

    if (type === "nearest-player") {
      filter.closest = 1;
      type = "players";
    }

    // Results

    let result: Entity[] = [];
    switch (type) {
      case "all":
        result = player.dimension.getEntities(filter);
        break;

      case "players":
        result = player.dimension.getPlayers(filter);
        break;

      case "random-player":
        const players = player.dimension.getPlayers(filter);
        result = [players[Math.floor(Math.random() * players.length)]];
        break;
    }

    return result;
  }
}
