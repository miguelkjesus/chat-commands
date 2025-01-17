import type { Player } from "@minecraft/server";
import type { Invocation } from "./invocation";
import type { Resolvable } from "../resolvers";
import type { Parameter } from "../parameters/parameter";
import type { TokenStream } from "../token-stream";

import { CommandManager } from "./command-manager";
import { bound } from "../utils/decorators";

export class Command {
  parent?: Command | CommandManager;

  name: string;
  description?: Resolvable<(player: Player) => string>;
  checks: Resolvable<(player: Player) => boolean>[] = [];
  overloads: Parameter[][] = [];
  subcommands: Command[] = [];

  @bound accessor execute: (ctx: Invocation) => void = () => {};

  get fullName(): string | undefined {
    if (this.parent instanceof CommandManager) {
      return this.parent.prefix + this.name;
    }

    if (this.parent instanceof Command) {
      return this.parent.fullName + " " + this.name;
    }
  }

  constructor(name: string) {
    this.name = name;
  }

  parse(stream: TokenStream): void {
    // TODO!
  }
}
