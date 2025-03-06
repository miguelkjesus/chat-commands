import type { Player } from "@minecraft/server";

import type { Arguments, Parameter } from "~/parameters";

import type { CommandManager } from "./command-manager";
import { Overload } from "./overload";
import { Command } from "./command";

export class Invocation<TParams extends Record<string, Parameter> = Record<string, Parameter>> {
  readonly manager: CommandManager;
  readonly player: Player;
  readonly message: string;
  readonly args: Arguments<TParams>;
  readonly overload: Overload; // TODO: typing
  readonly command: Command; // TODO: typing

  constructor(
    manager: CommandManager,
    player: Player,
    message: string,
    args: Arguments<TParams>,
    overload: Overload,
    command: Command,
  ) {
    this.manager = manager;
    this.player = player;
    this.message = message;
    this.args = args;
    this.overload = overload;
    this.command = command;
  }
}
