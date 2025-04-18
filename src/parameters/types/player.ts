import { world, type Player } from "@minecraft/server";

import { StringParser } from "~/tokens";
import { getBestMatch } from "~/utils/string";

import type { ParameterParseTokenContext, ParameterParseValueContext } from "../parameter-parse-context";
import { Parameter } from "./parameter";

export class PlayerParameter extends Parameter<Player, string> {
  typeName = "player";

  parseToken({ stream }: ParameterParseTokenContext) {
    return stream.pop(new StringParser());
  }

  parseValue({ token }: ParameterParseValueContext<string>) {
    const name = token.value;
    const target = world.getPlayers({ name })[0];

    if (target === undefined) {
      const playerNames = world.getAllPlayers().map((player) => player.name);
      const bestMatch = getBestMatch(name, playerNames);
      const suggestion = bestMatch ? ` Did you mean ${bestMatch}?` : "";

      throw token.error(`${name} is not a valid player.${suggestion}`).state;
    }

    return target;
  }
}
