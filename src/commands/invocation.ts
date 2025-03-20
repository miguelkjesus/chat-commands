import type { Player } from "@minecraft/server";

import type { CommandManager } from "./command-manager";
import { Overload, OverloadParameters } from "./overload";
import { Command } from "./command";
import { ChatCommandError } from "~/errors";

export class Invocation<InvokedOverload extends Overload = Overload> {
  readonly manager: CommandManager;
  readonly player: Player;
  readonly message: string;
  readonly overload: InvokedOverload;
  readonly parameters: OverloadParameters<InvokedOverload>;
  readonly command: Command; // TODO typing

  constructor(manager: CommandManager, player: Player, message: string, overload: InvokedOverload, command: Command) {
    this.manager = manager;
    this.player = player;
    this.message = message;
    this.overload = overload;
    this.parameters = overload.parameters as OverloadParameters<InvokedOverload>;
    this.command = command;
  }

  error(message: string) {
    return new ChatCommandError(message);
  }
}
