import { type Command, CommandCollection, Overload } from "~/commands";

import { Builder, StateOf } from "./builder";
import { OverloadBuilder } from "./overload-builder";

export class CommandBuilder<T extends Command> extends Builder<T> {
  aliases(...aliases: string[]) {
    this.__state.aliases = aliases;
    return this.__set({ aliases } as Partial<T>);
  }

  description(description: string) {
    return this.__set({ description } as Partial<T>);
  }

  subcommands(subcommands_: Command[]) {
    for (const subcommand of subcommands_) {
      subcommand.parent = this.__state as Command<any>;
    }

    this.__default({ subcommands: new CommandCollection() });
    return this.__mutate(({ subcommands }) => subcommands!.add(...subcommands_));
  }

  overloads<const TOverloads extends readonly Overload[]>(
    ...overloads: {
      [K in keyof TOverloads]: OverloadBuilder<TOverloads[K]>;
    }
  ) {
    const builtOverloads = overloads.map((builder) => builder.__state) as unknown as TOverloads;

    return this.__set<CommandBuilder<Command<TOverloads>>>({
      overloads: builtOverloads,
    });
  }
}
