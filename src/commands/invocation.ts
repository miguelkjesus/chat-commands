import type { Player } from "@minecraft/server";

import type { CommandManager } from "./command-manager";
import { Overload, OverloadParameters } from "./overload";
import { Command } from "./command";
import { ChatCommandError } from "~/errors";

export class Invocation<InvokedOverload extends Overload = Overload> {
  /** The command manager that handled this invocation. */
  readonly manager: CommandManager;
  /** The player that invoked this overload. */
  readonly player: Player;
  /** The full message that the player sent in the chat. */
  readonly message: string;
  /** The overload that was invoked. */
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
