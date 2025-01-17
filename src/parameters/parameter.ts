import { Player } from "@minecraft/server";
import { Resolvable } from "../resolvers";
import { isCallable } from "../utils/types";
import { Invocation } from "../command";
import { TokenStream } from "../token-stream";

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
    if (this.optional) {
      if (this.optional.defaultValue) {
        const defaultString = isCallable(this.optional.defaultValue)
          ? "function"
          : this.optional.defaultValue;

        return `[${this.name} = ${defaultString}]`;
      }
      return `[${this.name}]`;
    }
    return this.name;
  }
}

export class ParameterParseContext {
  readonly invocation: Invocation;
  readonly stream: TokenStream;
  readonly params: Parameter[];

  constructor(invocation: Invocation, params: Parameter[]) {
    this.invocation = invocation;
    this.stream = new TokenStream(invocation.message);
    this.params = params;
  }
}
