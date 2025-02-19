import type { Player } from "@minecraft/server";

import type { CommandManager } from "~/commands";
import { TokenStream } from "~/tokens";
import { Resolvable } from "~/utils/resolvers";
import { isCallable } from "~/utils/types";

export abstract class Parameter<T = any, Name extends string = string> {
  readonly name: Name;
  description?: Resolvable<(player: Player) => string>;
  optional?: { defaultValue?: T };

  constructor(name: Name) {
    this.name = name;
  }

  abstract parse(context: ParameterParseContext): T;

  toString() {
    if (!this.optional) return this.name;
    if (!this.optional.defaultValue) return `[${this.name}]`;

    const defaultString = isCallable(this.optional.defaultValue) ? "function" : this.optional.defaultValue;
    return `[${this.name} = ${defaultString}]`;
  }
}

export class ParameterParseContext<Params extends readonly Parameter[] = Parameter[]> {
  readonly manager: CommandManager;
  readonly player: Player;
  readonly message: string;
  readonly tokens: TokenStream;
  readonly params: Params;

  constructor(manager: CommandManager, player: Player, message: string, tokens: TokenStream, params: Params) {
    this.manager = manager;
    this.player = player;
    this.message = message;
    this.tokens = tokens;
    this.params = params;
  }
}
