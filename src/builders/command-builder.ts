import type { Parameter } from "~/parameters";
import { type Command, CommandCollection } from "~/commands";

import type { ParameterBuilder } from "./parameters";
import { Builder } from "./builder";

export class CommandBuilder<Params extends readonly Parameter[]> extends Builder<Command<Params>> {
  aliases(...aliases: string[]) {
    return this.__set({ aliases });
  }

  description(description: Command["description"]) {
    return this.__set({ description });
  }

  execute(execute: Command<Params>["execute"]) {
    return this.__set({ execute });
  }

  subcommands(subcommands: Command[]) {
    for (const subcommand of subcommands) {
      subcommand.parent = this.__state as Command<any>;
    }
    return this.__set({ subcommands: new CommandCollection(...subcommands) });
  }

  parameters<T extends readonly Parameter[]>(parameters: {
    [K in keyof T]: ParameterBuilder<T[K]>;
  }): CommandBuilder<T> {
    return this.__set({
      parameters: parameters.map((builder) => builder.__state) as any,
    }) as any as CommandBuilder<T>;
  }
}
