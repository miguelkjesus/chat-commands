import { world } from "@minecraft/server";

import { TokenStream } from "~/tokens";

import type { Command } from "./command";
import { Invocation } from "./invocation";
import { CommandCollection } from "./command-collection";

export class CommandManager {
  prefix: string;
  commands = new CommandCollection();

  constructor(prefix: string) {
    this.prefix = prefix;
  }

  listen(): void {
    world.beforeEvents.chatSend.subscribe((event) => {
      if (!event.message.startsWith(this.prefix)) return;

      const stream = new TokenStream(event.message.slice(this.prefix.length));
      const command = this.getInvokedCommand(stream);
      if (!command) return;

      const invocation = new Invocation(this, event.sender, event.message);
      command.execute(invocation);
    });
  }

  private getInvokedCommand(stream: TokenStream): Command | undefined {
    // things to consider:
    // command names may be multiple tokens.
    // maybe easier to transform a command "teleport to" to a command and subcommand "teleport" and "to"
    return;
  }
}
