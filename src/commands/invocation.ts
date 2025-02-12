import type { Player } from "@minecraft/server";
import type { CommandManager } from "./command-manager";

export class Invocation {
  readonly manager: CommandManager;
  readonly player: Player;
  readonly message: string;
  readonly args: Record<string, any> = {}; // TODO: args

  constructor(manager: CommandManager, player: Player, message: string) {
    this.manager = manager;
    this.player = player;
    this.message = message;
  }
}
