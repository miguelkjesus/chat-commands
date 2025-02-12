import type { Player } from "@minecraft/server";

import type { Resolvable } from "~/utils/resolvers";
import type { Parameter } from "~/parameters";
import { bound } from "~/utils/decorators";

import type { Invocation, KwArgs } from "./invocation";
import { CommandCollection } from "./command-collection";

export class Command<Params extends readonly Parameter[] = Parameter[]> {
  parent?: Command;

  subname: string;
  aliases: string[] = [];
  description?: Resolvable<(player: Player) => string>;
  checks: Resolvable<(player: Player) => boolean>[] = [];
  parameters: Params; // TODO: Introduce behaviour for multiple overloads
  subcommands = new CommandCollection();

  @bound accessor execute: (ctx: Invocation<KwArgs<Params>>) => void | undefined;

  constructor(subname: string) {
    this.subname = subname;
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
}

export type CommandParams<T extends Command> = T extends Command<infer Params> ? Params : never;

export type CommandArgs<T extends Command> = KwArgs<CommandParams<T>>;
