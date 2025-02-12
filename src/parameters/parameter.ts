import { Player } from "@minecraft/server";
import { Resolvable } from "~/utils/resolvers";
import { isCallable } from "~/utils/types";
import { Invocation } from "~/commands";
import { TokenStream } from "~/tokens";

export abstract class Parameter<T = any> {
  name: string;
  description?: Resolvable<(player: Player) => string>;
  optional?: { defaultValue?: T };

  constructor(name: string) {
    this.name = name;
  }

  abstract parse(context: ParameterParseContext): T;

  toString() {
    if (!this.optional) return this.name;

    if (!this.optional.defaultValue) return `[${this.name}]`;

    const defaultString = isCallable(this.optional.defaultValue)
      ? "function"
      : this.optional.defaultValue;

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
