import type { Player } from "@minecraft/server";

import type { ParameterParseTokenContext, ParameterParseValueContext } from "../parameter-parse-context";
import { Parameter } from "./parameter";

export class PlayerParameter extends Parameter<Player[]> {
  typeName = "player";

  parseToken({ tokens }: ParameterParseTokenContext) {
    return tokens.pop();
  }

  parseValue({ token: name, player }: ParameterParseValueContext<string>): Player[] {
    if (name === undefined) return [];

    return player.dimension.getPlayers({ name });
  }
}
