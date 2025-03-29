import { CommandBuilder } from "~/builders";
import { Command, manager } from "~/commands";

/**
 * Creates a new command with a specified name and optional aliases.
 *
 * @example
 * const teleport = command("teleport", "tp", "warp", "goto")
 *   .setDescription("Teleport entities to a specified location or another entity.");
 *
 * @param name
 *    The primary key word used to trigger the command. This will be shown by default in places like help menus.
 * @param aliases
 *    Alternative names that can also trigger the command.
 * @returns
 *    A builder instance for configuring the command.
 */
export function command(name: string, ...aliases: string[]) {
  const builder = new CommandBuilder(new Command(name, aliases));
  manager.commands.add(builder.state);
  return builder;
}
