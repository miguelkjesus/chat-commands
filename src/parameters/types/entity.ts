/* 
TODO:

- Introduce custom behaviours?
  - dimension selectors
  - allow lists for selectors that currently dont e.g. @a[tag=team_red, tag=team_blue]
  - custom concise syntax? e.g. @a[tag=team_red | team_blue]
  - compatibility with java edition selectors?
*/

import type { Entity } from "@minecraft/server";

import type { TargetSelector } from "~/utils/target-selector";
import { ValueError } from "~/errors";
import { parsers } from "~/tokens";

import type {
  ParameterParseTokenContext,
  ParameterParseValueContext,
  ParameterValidateContext,
} from "../parameter-parse-context";
import { Parameter } from "./parameter";

export class EntityParameter extends Parameter<Entity[], TargetSelector> {
  typeName = "entity";

  maxCount = Infinity;
  minCount = 0;

  parseToken({ tokens }: ParameterParseTokenContext) {
    return tokens.pop(parsers.targetSelector);
  }

  parseValue({ token: selector, player }: ParameterParseValueContext<TargetSelector>): Entity[] {
    if (selector === undefined) return [];

    if (typeof selector === "string") {
      return player.dimension.getPlayers({ name: selector });
    } else {
      return selector.execute(player);
    }
  }

  validate({ value }: ParameterValidateContext<Entity[]>) {
    if (value.length < this.minCount) {
      throw new ValueError(`Too little entities! Expected at least ${this.minCount}`);
    }

    if (value.length > this.maxCount) {
      throw new ValueError(`Too many entities! Expected a string with a length of at most ${this.maxCount}`);
    }
  }
}
