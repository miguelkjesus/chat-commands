import type { Resolvable } from "~/utils/resolvers";
import { type ParameterTypes, overload } from "~/api";
import { type Command, Overload } from "~/commands";

import { Builder } from "./builder";
import { OverloadBuilder } from "./overload-builder";
import { ParameterBuilder, ParametersFromBuilders } from "./parameter-types";

export class CommandBuilder<Overloads extends readonly Overload[] = readonly Overload[]> extends Builder<
  Command<Overloads>
> {
  aliases(...aliases: string[]) {
    this.state.aliases = aliases;
    return this;
  }

  description(description: string) {
    this.state.description = description;
    return this;
  }

  overloads<T extends readonly OverloadBuilder[]>(...overloads: T) {
    this.state.overloads = overloads.map((builder) => builder.state as OverloadsFromBuilders<T>[number]) as any;
    return this as any as CommandBuilder<OverloadsFromBuilders<T>>;
  }

  overload(): OverloadBuilder<{}>;
  overload<ParamBuilders extends Record<string, ParameterBuilder>>(
    parameters: Resolvable<(t: ParameterTypes) => ParamBuilders>,
  ): OverloadBuilder<ParametersFromBuilders<ParamBuilders>>;
  overload<ParamBuilders extends Record<string, ParameterBuilder>>(
    parameters?: Resolvable<(t: ParameterTypes) => ParamBuilders>,
  ): OverloadBuilder<ParametersFromBuilders<ParamBuilders>> {
    // TODO refactor how builders work such that either
    //  - they are constructed and readonly
    //  - keep them dynamic like now but without the typing (kinda shit)
    const builder = overload(parameters as any);
    this.state.overloads = [...this.state.overloads, builder.state] as any;
    return builder;
  }

  afterExecute(callback: Command<Overloads>["afterExecute"]) {
    this.state.afterExecute = callback;
    return this;
  }

  beforeExecute(callback: Command<Overloads>["beforeExecute"]) {
    this.state.beforeExecute = callback;
    return this;
  }
}

export type OverloadsFromBuilders<T> = {
  [K in keyof T]: T[K] extends OverloadBuilder<infer U> ? Overload<U> : never;
};
