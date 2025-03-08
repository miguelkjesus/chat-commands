import type { Player } from "@minecraft/server";

import type { Arguments, Parameter } from "~/parameters";

import type { CommandManager } from "./command-manager";
import { Overload } from "./overload";
import { Command } from "./command";

export class Invocation {
  readonly manager: CommandManager;
  readonly player: Player;
  readonly message: string;
  readonly overload: Overload; // TODO: typing
  readonly command: Command; // TODO: typing

  constructor(manager: CommandManager, player: Player, message: string, overload: Overload, command: Command) {
    this.manager = manager;
    this.player = player;
    this.message = message;
    this.overload = overload;
    this.command = command;
  }
}
