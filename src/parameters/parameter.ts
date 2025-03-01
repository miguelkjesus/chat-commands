import type { Player } from "@minecraft/server";

import type { CommandManager } from "~/commands";
import { ParseError, TokenStream } from "~/tokens";
import { Resolvable } from "~/utils/resolvers";
import { isCallable } from "~/utils/types";

export abstract class Parameter<T = any, Name extends string = string> {
  readonly name: Name;
  displayName?: Resolvable<(player: Player) => string>;
  description?: Resolvable<(player: Player) => string>;
  optional?: { defaultValue?: T };

  checks: Check<T>[] = [];

  constructor(name: Name) {
    this.name = name;
  }

  abstract parse(context: ParameterParseContext): T;

  isValid(value: T) {
    for (const check of this.checks) {
      check.assert(value);
    }
  }

  toString() {
    if (!this.optional) return this.name;
    if (!this.optional.defaultValue) return `[${this.name}]`;

    const defaultString = isCallable(this.optional.defaultValue) ? "function" : this.optional.defaultValue;
    return `[${this.name} = ${defaultString}]`;
  }
}

export class ParameterParseContext<const Params extends Parameter[] = Parameter[]> {
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

export class Check<T> {
  test: (value: T) => boolean;
  errorMessage: string;

  constructor(callback: (value: T) => boolean, errorMessage: string) {
    this.test = callback;
    this.errorMessage = errorMessage;
  }

  assert(value: T) {
    if (!this.test(value)) {
      throw new ParseError(this.errorMessage);
    }
  }
}

export type ParameterType<T extends Parameter> = T extends Parameter<infer Type> ? Type : never;
