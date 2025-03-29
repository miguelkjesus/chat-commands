import type { Player } from "@minecraft/server";

import type { ParameterParseTokenContext, ParameterParseValueContext } from "../parameter-parse-context";
import { Parameter } from "./parameter";
import { ParseError } from "~/errors";

export class PlayerParameter extends Parameter<Player, string> {
  typeName = "player";

  parseToken({ tokens }: ParameterParseTokenContext) {
    return tokens.pop();
  }

  parseValue({ token: name, player }: ParameterParseValueContext<string>): Player {
    const plr = player.dimension.getPlayers({ name })[0];

    if (plr === undefined) {
      throw new ParseError("Not a player");
    }

    return plr;
  }
}
