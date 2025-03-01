import type { Player } from "@minecraft/server";
import type { Arguments, Parameter } from "~/parameters";
import type { CommandManager } from "./command-manager";

export class Invocation<const TParams extends Record<string, Parameter> = Record<string, Parameter>> {
  readonly manager: CommandManager;
  readonly player: Player;
  readonly message: string;
  readonly args: Arguments<TParams>;

  constructor(manager: CommandManager, player: Player, message: string, args: Arguments<TParams>) {
    this.manager = manager;
    this.player = player;
    this.message = message;
    this.args = args;
  }
}
