import { CommandBuilder } from "~/builders";
import { Command } from "~/commands";

import { manager } from "./command-manager";

export function command(name: string, ...aliases: string[]) {
  // TODO, what to do about multiple token names?

  const builder = new CommandBuilder(new Command(name, aliases, []));
  manager.commands.add(builder.__state);
  return builder;
}
