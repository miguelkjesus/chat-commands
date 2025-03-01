import { TokenStream } from "~/tokens";
import { CommandCollection } from "./command-collection";
import { Overload } from "./overload";

export class Command<const Overloads extends readonly Overload[] = readonly Overload[]> {
  parent?: Command;

  readonly subname: string;
  aliases: string[] = [];
  description?: string;
  overloads: Overloads;
  subcommands = new CommandCollection();

  constructor(subname: string, aliases: string[], overloads: Overloads) {
    this.subname = subname.trim();
    this.aliases = aliases;
    this.overloads = overloads;
  }

  get name(): string {
    if (this.parent) {
      return this.parent.name + " " + this.subname;
    }

    return this.subname;
  }

  *descendants() {
    const queue = [...this.subcommands];

    let command: Command | undefined;
    while ((command = queue.shift())) {
      yield command;
      queue.push(...command.subcommands);
    }
  }

  getInvokedOverload(tokens: TokenStream): Overload {
    // TODO
  }
}

export type CommandOverloads<T extends Command> = T extends Command<infer Overloads> ? Overloads : never;
