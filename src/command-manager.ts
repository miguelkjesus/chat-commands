import { world } from "@minecraft/server";
import { CommandBuilder } from "./builders/command-builder";
import { CommandInvocationContext, computeCommand } from "./command";

export const commandManagerState = {
  prefix: ".",
  commandBuilders: <CommandBuilder[]> [],
};

export function prefix(prefix: string) {
  commandManagerState.prefix = prefix;
}

export function command(name: string) {
  let builder = new CommandBuilder({ name });
  commandManagerState.commandBuilders.push(builder);
  return builder;
}

export function start() {
  world.beforeEvents.chatSend.subscribe((ev) => {
    const context: CommandInvocationContext = {
      player: ev.sender,
      message: ev.message,
    };

    const commands = commandManagerState.commandBuilders.map((builder) => computeCommand(builder.$state, context));
    // TODO
  })
}

