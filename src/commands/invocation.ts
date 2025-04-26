import type { Player } from "@minecraft/server";

import { ChatCommandError } from "~/errors";
import type { ArgumentTokens } from "~/parameters";

import { Command } from "./command";
import type { CommandManager } from "./command-manager";
import { Overload, OverloadParameters } from "./overload";

export class Invocation<InvokedOverload extends Overload = Overload> {
  /** The command manager that handled this invocation. */
  readonly manager: CommandManager;
  /** The player that invoked this overload. */
  readonly player: Player;
  /** The full message that the player sent in the chat. */
  readonly message: string;
  /** The overload that was invoked. */
  readonly overload: InvokedOverload;
  /** The parameters of the overload. */
  readonly parameters: OverloadParameters<InvokedOverload>;
  /** TODO */
  readonly argumentTokens: ArgumentTokens<OverloadParameters<InvokedOverload>>;
  /** TODO */
  readonly command: Command;

  constructor(
    manager: CommandManager,
    player: Player,
    message: string,
    overload: InvokedOverload,
    argumentTokens: ArgumentTokens<OverloadParameters<InvokedOverload>>,
    command: Command,
  ) {
    this.manager = manager;
    this.player = player;
    this.message = message;
    this.overload = overload;
    this.parameters = overload.getParameters(player) as OverloadParameters<InvokedOverload>;
    this.argumentTokens = argumentTokens;
    this.command = command;
  }

  error(message: string) {
    return new ChatCommandError(message);
  }
}
