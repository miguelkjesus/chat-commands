import { CommandBuilder } from "~/builders";
import { Command } from "~/commands";

import { commandManager } from "./command-manager";

export function command(name: string) {
  const builder = new CommandBuilder(new Command(name));
  commandManager.commands.add(builder.__state as Command);
  return builder;
}
