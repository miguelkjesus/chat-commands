import { CommandBuilder } from "~/builders";
import { Command } from "~/commands";
import { tokenize } from "~/tokens";

import { commandManager } from "./command-manager";

export function command(name: string) {
  const subnames = tokenize(name);

  let parentBuilder: CommandBuilder<any> | undefined;
  for (const subname of subnames) {
    const builder = new CommandBuilder(new Command(subname));
    commandManager.commands.add(builder.__state); // register command

    if (parentBuilder) {
      parentBuilder.subcommands([builder.__state]); // set current as child of last
      parentBuilder = builder;
    }

    parentBuilder = builder;
  }

  return parentBuilder!;
}
