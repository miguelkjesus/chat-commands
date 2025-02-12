import type { Player } from "@minecraft/server";
import type { Invocation } from "~/commands";
import { Resolvable } from "~/utils/resolvers";
import { isCallable } from "~/utils/types";
import { TokenStream } from "~/tokens";

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

export class ParameterParseContext {
  readonly invocation: Invocation;
  readonly tokens: TokenStream;
  readonly params: Parameter[];

  constructor(invocation: Invocation, params: Parameter[]) {
    this.invocation = invocation;
    this.tokens = new TokenStream(invocation.message);
    this.params = params;
  }
}
