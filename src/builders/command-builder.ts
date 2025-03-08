import { type Command, CommandCollection, Overload, OverloadParameters } from "~/commands";

import { Builder } from "./builder";
import { OverloadBuilder } from "./overload-builder";

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

  // subcommands(subcommands_: Command[]) {
  //   for (const subcommand of subcommands_) {
  //     subcommand.parent = this.__state as Command;
  //   }

  //   this.__default({ subcommands: new CommandCollection() });
  //   return this.__mutate(({ subcommands }) => subcommands!.add(...subcommands_));
  // }

  overloads<NewOverloads extends readonly Overload[]>(
    ...overloads: {
      [K in keyof NewOverloads]: OverloadBuilder<OverloadParameters<NewOverloads[K]>>;
    }
  ) {
    this.state.overloads = overloads.map((builder) => builder.state as NewOverloads[number]) as any;
    return this as any as CommandBuilder<NewOverloads>;
  }
}
