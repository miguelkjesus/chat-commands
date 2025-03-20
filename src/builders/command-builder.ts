import type { Resolvable } from "~/utils/resolvers";
import { type ParameterTypes, overload } from "~/api";
import { type Command, Overload } from "~/commands";

import { Builder } from "./builder";
import { OverloadBuilder, OverloadBuilderFromParameterBuilders } from "./overload-builder";
import { ParameterBuilder, ParametersFromBuilders } from "./parameter-types";

export class CommandBuilder<Overloads extends readonly Overload[] = readonly Overload[]> extends Builder<
  Command<Overloads>
> {
  setAliases(...aliases: string[]) {
    this.state.aliases = aliases;
    return this;
  }

  setDescription(description: string) {
    this.state.description = description;
    return this;
  }

  setOverloads<T extends readonly OverloadBuilder<Overload<any, any>>[]>(...overloads: T) {
    this.state.overloads = overloads.map((builder) => builder.state as OverloadsFromBuilders<T>[number]) as any;
    return this as any as CommandBuilder<OverloadsFromBuilders<T>>;
  }

  createOverload(): OverloadBuilder<Overload<{}>>;
  createOverload<ParamBuilders extends Record<string, ParameterBuilder>>(
    parameters: Resolvable<(t: ParameterTypes) => ParamBuilders>,
  ): OverloadBuilderFromParameterBuilders<ParamBuilders>;
  createOverload<ParamBuilders extends Record<string, ParameterBuilder>>(
    parameters?: Resolvable<(t: ParameterTypes) => ParamBuilders>,
  ): OverloadBuilderFromParameterBuilders<ParamBuilders> {
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
  [K in keyof T]: T[K] extends OverloadBuilder<infer U> ? U : never;
};
