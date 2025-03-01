import { Resolvable, resolve } from "~/utils/resolvers";
import { type Command, CommandCollection } from "~/commands";
import { type Parameter } from "~/parameters";
import { parameterTypes } from "~/api";

import type { ParameterBuilder } from "./parameters";
import { Builder } from "./builder";

export class CommandBuilder<const Params extends Parameter[]> extends Builder<Command<Params>> {
  aliases(...aliases: string[]) {
    return this.__set({ aliases });
  }

  description(description: Command["description"]) {
    return this.__set({ description });
  }

  execute(execute: Command<Params>["execute"]) {
    return this.__set({ execute });
  }

  subcommands(subcommands_: Command[]) {
    for (const subcommand of subcommands_) {
      subcommand.parent = this.__state as Command<any>;
    }

    this.__default({ subcommands: new CommandCollection() });
    return this.__mutate(({ subcommands }) => subcommands!.add(...subcommands_));
  }

  parameters<const T extends Parameter[]>(
    parameters: Resolvable<(types: typeof parameterTypes) => { [K in keyof T]: ParameterBuilder<T[K]> }>,
  ) {
    const p = resolve(parameters, [parameterTypes]).map((builder) => builder.__state) as T;

    const seenNames = new Set();
    for (const param of p) {
      if (seenNames.has(param.name)) {
        throw new Error("Parameter names must be unique.");
      }
      seenNames.add(param.name);
    }

    return this.__set<CommandBuilder<T>>({
      parameters: p,
    });
  }
}
