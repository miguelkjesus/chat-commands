import { ChatSendBeforeEvent, world } from "@minecraft/server";
import { darkGray, red, white } from "@mhesus/mcbe-colors";

import { ParseError, TokenStream } from "~/tokens";
import { ParameterParseContext } from "~/parameters";

import type { Command, CommandArgs } from "./command";
import { CommandCollection } from "./command-collection";
import { Invocation } from "./invocation";

export class CommandManager {
  prefix?: string;
  commands = new CommandCollection();

  listen(): void {
    if (this.prefix === undefined) return;

    world.beforeEvents.chatSend.subscribe((event) => {
      if (!event.message.startsWith(this.prefix!)) return;
      event.cancel = true;

      event.sender.sendMessage(darkGray(`You executed: ${event.message}`));

      const tokens = new TokenStream(event.message.slice(this.prefix!.length));
      const command = this.getInvokedCommand(tokens);

      if (command === undefined) {
        // TODO: Reccommend similar commands.
        // TODO: Additional message if /help has not been registered.
        event.sender.sendMessage(red(`Unknown or incomplete command. Type ${white(this.prefix + "help")} for help.`));
        return;
      }

      const args = this.getArguments(command, event, tokens);
      if (args === undefined) return;

      const invocation = new Invocation(this, event.sender, event.message, args);

      try {
        command.execute?.(invocation);
      } catch (err) {
        event.sender.sendMessage(
          red(
            "Unexpected error while running this command. Please contact the server owner or the behaviour pack owner.",
          ),
        );
      }
    });
  }

  private getInvokedCommand(stream: TokenStream): Command | undefined {
    let search = [...this.commands].filter((cmd) => cmd.parent === undefined);

    let command: Command | undefined;
    let token: string | undefined;
    while ((token = stream.peek())) {
      const match = search.find((cmd) => cmd.subname === token || cmd.aliases.includes(token!));
      if (!match) return command;

      command = match;
      search = [...command.subcommands];
      stream.pop();
    }
  }

  private getArguments<T extends Command>(
    command: Command,
    event: ChatSendBeforeEvent,
    stream: TokenStream,
  ): CommandArgs<T> | undefined {
    let args = {} as CommandArgs<T>;
    for (const param of command.parameters) {
      const context = new ParameterParseContext(this, event.sender, event.message, stream, command.parameters);

      try {
        args[param.name] = param.parse(context);
      } catch (err) {
        if (!(err instanceof ParseError)) {
          event.sender.sendMessage(
            red(
              "Unexpected error while running this command. Please contact the server owner or the behaviour pack owner.",
            ),
          );
          return;
        }

        event.sender.sendMessage(red(err.message));
        return;
      }
    }
    return args;
  }
}
