import type { Player } from "@minecraft/server";

import type { Resolvable } from "~/utils/resolvers";
import type { Parameter } from "~/parameters";
import { bound } from "~/utils/decorators";

import type { Invocation, KwArgs } from "./invocation";
import { CommandCollection } from "./command-collection";

export class Command<Parameters extends readonly Parameter[] = Parameter[]> {
  parent?: Command;

  name: string;
  aliases: string[] = [];
  description?: Resolvable<(player: Player) => string>;
  checks: Resolvable<(player: Player) => boolean>[] = [];
  parameters: Parameters; // TODO: Introduce behaviour for multiple overloads eventually
  subcommands = new CommandCollection();

  @bound accessor execute: (ctx: Invocation<KwArgs<Parameters>>) => void = () => {};

  constructor(name: string) {
    this.name = name;
  }

  get fullName(): string {
    if (this.parent) {
      return this.parent.fullName + " " + this.name;
    }

    return this.name;
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
