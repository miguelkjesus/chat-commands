import type { Player } from "@minecraft/server";
import type { Parameter } from "~/parameters";
import type { CommandManager } from "./command-manager";

export class Invocation<Args extends {} = any> {
  readonly manager: CommandManager;
  readonly player: Player;
  readonly message: string;
  readonly args: Args;

  constructor(manager: CommandManager, player: Player, message: string, args: Args) {
    this.manager = manager;
    this.player = player;
    this.message = message;
    this.args = args;
  }
}

export type KwArgs<Params extends readonly Parameter[]> = {
  [P in Params[number] as P["name"]]: P extends Parameter<infer T> ? T : never;
};
