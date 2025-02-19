import type { Player } from "@minecraft/server";
import { Parameter, type ParameterParseContext } from "./parameter";

export class PlayerParameter<Name extends string> extends Parameter<Player[], Name> {
  parse({ tokens, player }: ParameterParseContext): Player[] {
    const name = tokens.pop();
    if (name === undefined) return [];

    return player.dimension.getPlayers({ name });
  }
}
