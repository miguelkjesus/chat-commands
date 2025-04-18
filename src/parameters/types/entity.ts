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
import { TargetSelectorParser } from "~/tokens";

import type { ParameterParseTokenContext, ParameterParseValueContext } from "../parameter-parse-context";
import { Parameter } from "./parameter";

export class EntityParameter extends Parameter<Entity[], TargetSelector> {
  typeName = "entity";

  maxCount = Infinity;
  minCount = 0;

  // TODO add a selector which input must match

  parseToken({ stream }: ParameterParseTokenContext) {
    return stream.pop(new TargetSelectorParser());
  }

  parseValue({ token, player }: ParameterParseValueContext<TargetSelector>): Entity[] {
    const entities = token.value.execute(player);

    if (entities.length < this.minCount) {
      throw token.error(`Too little entities! Expected at least ${this.minCount}`).state;
    }

    if (entities.length > this.maxCount) {
      throw token.error(`Too many entities! Expected a string with a length of at most ${this.maxCount}`).state;
    }

    return entities;
  }
}
