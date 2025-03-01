import type { Player } from "@minecraft/server";
import type { Parameter } from "~/parameters";
import type { CommandManager } from "./command-manager";
import { Command } from "./command";

export class Invocation<const Params extends Parameter[]> {
  readonly manager: CommandManager;
  readonly command: Command<Params>;
  readonly player: Player;
  readonly message: string;
  readonly args: KeywordArguments<Params>;

  constructor(manager: CommandManager, player: Player, message: string, args: KeywordArguments<Params>) {
    this.manager = manager;
    this.player = player;
    this.message = message;
    this.args = args;
  }
}

export type KeywordArguments<Params extends readonly Parameter[]> = {
  [P in Params[number] as P["name"]]: P extends Parameter<infer T> ? T : never;
};
