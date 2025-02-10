import type { Player } from "@minecraft/server";

import type { Resolvable } from "~/resolvers";
import type { Parameter } from "~/parameters";
import { bound } from "~/utils/decorators";

import type { Invocation } from "./invocation";

export class Command {
  parent?: Command;

  name: string;
  description?: Resolvable<(player: Player) => string>;
  checks: Resolvable<(player: Player) => boolean>[] = [];
  overloads: Parameter[][] = [];
  subcommands: Command[] = [];

  @bound accessor execute: (ctx: Invocation) => void = () => {};

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
