import { ChatSendBeforeEvent, world } from "@minecraft/server";

import { TokenStream } from "~/tokens";
import { ParameterParseContext } from "~/parameters";

import type { Command, CommandArgs } from "./command";
import { Invocation } from "./invocation";
import { CommandCollection } from "./command-collection";

export class CommandManager {
  prefix?: string;
  commands = new CommandCollection();

  listen(): void {
    world.beforeEvents.chatSend.subscribe((event) => {
      if (!event.message.startsWith(this.prefix)) return;

      const tokens = new TokenStream(event.message.slice(this.prefix.length));
      const command = this.getInvokedCommand(tokens);
      if (!command) return;

      const args = this.getArguments(command, event, tokens);
      const invocation = new Invocation(this, event.sender, event.message, args);
      command?.execute(invocation);
    });
  }

  private getInvokedCommand(stream: TokenStream): Command | undefined {
    let search = [...this.commands].filter((cmd) => cmd.parent === undefined);

    let command: Command | undefined;
    let token: string | undefined;
    while ((token = stream.pop())) {
      const match = search.find((cmd) => cmd.subname === token || cmd.aliases.includes(token));
      if (!match) return command;
      command = match;
      search = [...command.subcommands];
    }
  }

  private getArguments<T extends Command>(
    command: Command,
    event: ChatSendBeforeEvent,
    stream: TokenStream,
  ): CommandArgs<T> {
    let args = {} as CommandArgs<T>;
    for (const param of command.parameters) {
      const context = new ParameterParseContext(this, event.sender, event.message, stream, command.parameters);
      args[param.name] = param.parse(context);
    }
    return args;
  }
}
