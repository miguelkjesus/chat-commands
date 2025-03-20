import { CommandBuilder } from "~/builders";
import { Command, manager, Overload } from "~/commands";

export function command(name: string, ...aliases: string[]) {
  const builder = new CommandBuilder(new Command(name, aliases, [] as Overload[]));
  manager.commands.add(builder.state);
  return builder;
}
