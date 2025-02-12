import type { Parameter } from "~/parameters";
import { type Command, CommandCollection } from "~/commands";

import type { ParameterBuilder } from "./parameters";
import { Builder } from "./builder";

export class CommandBuilder extends Builder<Command> {
  aliases(...aliases: string[]) {
    return this.__set({ aliases });
  }

  description(description: Command["description"]) {
    return this.__set({ description });
  }

  execute(execute: Command["execute"]) {
    return this.__set({ execute });
  }

  subcommands(...subcommands: Command[]) {
    for (const subcommand of subcommands) {
      subcommand.parent = this.__state as Command;
    }
    return this.__set({ subcommands: new CommandCollection(...subcommands) });
  }

  parameters(...parameters: ParameterBuilder<any>[]) {
    return this.__set({
      parameters: parameters.map(
        (builder) => builder.__state as Parameter<any>
      ),
    });
  }
}
