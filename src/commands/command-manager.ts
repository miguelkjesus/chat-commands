import { Style } from "@mhesus/mcbe-colors";
import { type ChatSendBeforeEvent, world } from "@minecraft/server";

import { ChatCommandError } from "~/errors";
import { CommandParser, TokenStream } from "~/tokens";
import { CommandCollection } from "./command-collection";

export class CommandManager {
  commands = new CommandCollection();

  private _isStarted = false;
  private _prefix!: string;

  get isStarted() {
    return this._isStarted;
  }

  get prefix() {
    return this._prefix;
  }

  set prefix(prefix: string) {
    this.assertValidPrefix(prefix);
    this._prefix = prefix;
  }

  assertValidPrefix(prefix: string) {
    if (!prefix) throw new Error("Prefix cannot be undefined or empty.");
    if (prefix.startsWith("/")) throw new Error('Prefix cannot start with "/"');
  }

  /**
   * Sets the prefix to be used for all commands and starts listening for chat commands. \
   * The prefix determines how commands are recognised when entered by players.
   *
   * This should be called at least once, somewhere in your script.
   *
   * @example
   * manager.start("!")
   * // The command manager will now recognise commands prefixed with "!" (e.g., "!teleport")
   *
   * @param prefix
   *    The prefix to be used for commands (e.g., "!", ";", or any other character sequence)
   *
   *    Prefixes **cannot** start with "/" because Minecraft's built-in commands already use it. \
   *    Prefixes **cannot** be undefined or empty.
   * @throws
   *    If the prefix starts with "/". \
   *    If the prefix is undefined or empty.
   */
  start(prefix: string): void {
    if (this.isStarted) return;
    this.prefix = prefix;

    world.beforeEvents.chatSend.subscribe((event) => {
      this.processChatEvent(event);
    });

    this._isStarted = true;
  }

  private processChatEvent(event: ChatSendBeforeEvent) {
    const params = this.getCommandExecuteParams(event);
    if (!params) return;

    const { invocation, args } = params;

    try {
      invocation.overload.execute(invocation, args);
    } catch (err) {
      console.error(err);
      throw new ChatCommandError(
        "Uh oh! There was an unexpected error while running this command!\nPlease contact the behaviour pack owner",
      );
    }
  }

  private getCommandExecuteParams(event: ChatSendBeforeEvent) {
    const stream = new TokenStream(event.message);

    try {
      const params = stream.pop(new CommandParser(this, event)).value;
      if (!params) return;

      event.cancel = true;
      event.sender.sendMessage(Style.green(`You executed: ${event.message}`));

      return params;
    } catch (e) {
      event.cancel = true;
      event.sender.sendMessage(Style.green(`You executed: ${event.message}`));

      if (!(e instanceof ChatCommandError)) throw e;
      event.sender.sendMessage(Style.red(e.message));
    }
  }
}

export const manager = new CommandManager();
