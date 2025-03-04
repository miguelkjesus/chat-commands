import { type Command, CommandCollection, Overload, OverloadParameters } from "~/commands";

import { Builder } from "./builder";
import { OverloadBuilder } from "./overload-builder";

export class CommandBuilder<T extends readonly Overload[] = readonly Overload[]> extends Builder<Command<T>> {
  aliases(...aliases: string[]) {
    this.__state.aliases = aliases;
    return this.__set({ aliases } as Partial<Command<T>>);
  }

  description(description: string) {
    return this.__set({ description } as Partial<Command<T>>);
  }

  subcommands(subcommands_: Command[]) {
    for (const subcommand of subcommands_) {
      subcommand.parent = this.__state as Command;
    }

    this.__default({ subcommands: new CommandCollection() });
    return this.__mutate(({ subcommands }) => subcommands!.add(...subcommands_));
  }

  overloads<TOverloads extends readonly Overload[]>(
    ...overloads: {
      [K in keyof TOverloads]: OverloadBuilder<OverloadParameters<TOverloads[K]>>;
    }
  ) {
    const builtOverloads = overloads.map((builder) => builder.__state) as unknown as TOverloads;

    return this.__set<CommandBuilder<TOverloads>>({ overloads: builtOverloads });
  }
}
