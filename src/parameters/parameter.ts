import { Player } from "@minecraft/server";
import { Resolvable } from "../resolvers";
import { isCallable } from "../utils/types";
import { TokenStreamState } from "../token-stream/token-parser";
import { Invocation } from "../commands/invocation";

export abstract class Parameter<T = any> {
  name: string;
  aliases: string[] = [];
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
  readonly stream: TokenStreamState;
  readonly params: Parameter[];

  constructor(invocation: Invocation, params: Parameter[]) {
    this.invocation = invocation;
    this.stream = new TokenStreamState(invocation.message);
    this.params = params;
  }
}
