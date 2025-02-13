import type { Player } from "@minecraft/server";
import { Parameter, type ParameterParseContext } from "./parameter";

export class PlayerParameter<Name extends string> extends Parameter<Player, Name> {
  parse({ tokens, player }: ParameterParseContext): Player | undefined {
    const name = tokens.pop();
    return player.dimension.getPlayers({ name })[0];
  }
}
