import type { Player } from "@minecraft/server";

import type { ParameterParseContext } from "./parameter-parse-context";
import { Parameter } from "./parameter";

export class PlayerParameter extends Parameter<Player[]> {
  parse({ tokens, player }: ParameterParseContext): Player[] {
    const name = tokens.pop();
    if (name === undefined) return [];

    return player.dimension.getPlayers({ name });
  }
}
