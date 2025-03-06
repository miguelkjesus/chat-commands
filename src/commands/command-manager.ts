import { ChatSendBeforeEvent, world } from "@minecraft/server";
import { darkGray, gray, italic, red, white } from "@mhesus/mcbe-colors";

import { TokenStream } from "~/tokens";

import type { Command } from "./command";
import { CommandCollection } from "./command-collection";
import { Invocation } from "./invocation";
import { ParseError } from "~/errors";

export class CommandManager {
  prefix?: string;
  commands = new CommandCollection();

  start(): void {
    if (this.prefix === undefined) return;
    world.beforeEvents.chatSend.subscribe((event) => this.processEvent(event));
  }

  protected processEvent(event: ChatSendBeforeEvent) {
    if (!event.message.startsWith(this.prefix!)) return;
    event.cancel = true;

    event.sender.sendMessage(darkGray(`You executed: ${event.message}`));

    const tokens = new TokenStream(event.message.slice(this.prefix!.length));
    const command = this.getInvokedCommand(tokens);

    if (command === undefined) {
      // TODO: Reccommend similar commands.
      // TODO: Additional message if /help has not been registered.
      event.sender.sendMessage(red(`Unknown or incomplete command. Type ${white(this.prefix + "help")} for help!`));
      return;
    }

    const result = command.getInvokedOverload(event, tokens);
    if ("errors" in result) {
      event.sender.sendMessage(
        red(
          [
            "Command errored in the following overloads:",
            ...[...result.errors.entries()].flatMap(([overload, error]) => {
              if (!(error instanceof ParseError)) throw error;
              return [gray(`${this.prefix + command.name} ${overload.getSignature()}`), `  > ${italic(error.message)}`];
            }),
            `\nType ${white(this.prefix + "help teleport")} for help with this command!`,
          ].join("\n"),
        ),
      );
      return;
    }

    const { overload, args } = result;
    const invocation = new Invocation(this, event.sender, event.message, args);

    try {
      overload.execute?.(invocation, args);
    } catch (err) {
      event.sender.sendMessage(
        red(
          "Uh oh! There was an unexpected error while running this command!\nPlease contact the behaviour pack owner",
        ),
      );
      console.error(err);
    }
  }

  private getInvokedCommand(stream: TokenStream): Command | undefined {
    const name = stream.pop()!;
    return [...this.commands].find((cmd) => cmd.name === name || cmd.aliases.includes(name));
    // let search = [...this.commands].filter((cmd) => cmd.parent === undefined);
    //
    // let command: Command | undefined;
    // let token: string | undefined;
    // while ((token = stream.peek())) {
    //   const match = search.find((cmd) => cmd.subname === token || cmd.aliases.includes(token!));
    //   if (!match) return command;
    //
    //   command = match;
    //   search = [...command.subcommands];
    //   stream.pop();
    // }
  }
}
