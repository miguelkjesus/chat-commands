import { CommandBuilder } from "~/builders";
import { Command, manager } from "~/commands";

export function command(name: string, ...aliases: string[]) {
  const builder = new CommandBuilder(new Command(name, aliases, []));
  manager.commands.add(builder.state);
  return builder;
}
