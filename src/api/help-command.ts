import { HelpCommandBuilder } from "~/builders";
import { makeHelpCommand } from "~/commands";

makeHelpCommand();

/**
 * Provides options to configure or remove the built-in help command.
 *
 * By default, a built-in help command is provided. You can:
 * - **Modify** it using `helpCommand()`
 * - **Remove** it with `helpCommand().remove()`
 * - **Overwrite** it by redefining a new `"help"` command in your script.
 *
 * @example
 * // Customizing the built-in help command
 * helpCommand().setColors({
 *     // TODO
 *   })
 *
 * // Overwriting the built-in help command
 * command("help", "commands", "cmds", "?")
 *   .setDescription("My custom help command!")
 *
 * @returns A help command builder for configuration.
 */
export function helpCommand() {
  return new HelpCommandBuilder({});
}
