import { CommandBuilder } from "~/builders";
import { Command, manager, Overload } from "~/commands";

/**
 * Creates a new command with a specified name and optional aliases.
 *
 * @example
 * command("teleport", "tp", "warp", "goto")
 *   .setDescription("Teleport entities to a specified location or another entity.");
 *
 * @param name
 *    The primary key word used to trigger the command. This will be shown by default in places like help menus.
 * @param aliases
 *    Alternative names that can also trigger the command. These provide flexibility to your players.
 * @returns
 *    A builder instance for configuring the command.
 */
export function command(name: string, ...aliases: string[]) {
  const builder = new CommandBuilder(new Command(name, aliases, [] as Overload[]));
  manager.commands.add(builder.state);
  return builder;
}
