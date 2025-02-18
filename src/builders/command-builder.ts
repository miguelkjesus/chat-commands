import { StringParameter, type Parameter } from "~/parameters";
import { type Command, CommandCollection } from "~/commands";
import { Resolvable, resolve } from "~/utils/resolvers";

import type { ParameterBuilder } from "./parameters";
import { params } from "~/api";
import { Builder } from "./builder";

export class CommandBuilder<Params extends readonly Parameter[]> extends Builder<Command<Params>> {
  aliases(...aliases: string[]) {
    return this.__set({ aliases });
  }

  description(description: Command["description"]) {
    return this.__set({ description });
  }

  execute(execute: Command<Params>["execute"]) {
    return this.__set({ execute: execute?.bind(this.__state) });
  }

  subcommands(subcommands_: Command[]) {
    for (const subcommand of subcommands_) {
      subcommand.parent = this.__state as Command<any>;
    }

    this.__default({ subcommands: new CommandCollection() });
    return this.__mutate(({ subcommands }) => subcommands!.add(...subcommands_));
  }

  parameters<T extends readonly Parameter[]>(
    parameters: Resolvable<
      (types: typeof params) => {
        [K in keyof T]: ParameterBuilder<T[K]>;
      }
    >,
  ): CommandBuilder<T> {
    return this.__set({
      parameters: resolve(parameters, [params]).map((builder) => builder.__state) as any,
    }) as any as CommandBuilder<T>;
  }
}
