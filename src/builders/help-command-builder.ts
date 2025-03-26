import {
  type HelpCommandColorScheme,
  type HelpCommandOptions,
  makeHelpCommand,
  removeHelpCommandIfExists,
} from "~/commands";

import { Builder } from "./builder";

/**
 * A builder for configuring and managing the help command.
 *
 * This class provides methods to customize the help command's behavior,
 * including its description and aliases.
 */
export class HelpCommandBuilder extends Builder<HelpCommandOptions> {
  // TODO redo
  // setColorScheme(colors: Partial<HelpCommandColorScheme>) {
  //  this.state.colors = colors;
  //  makeHelpCommand(this.state);
  //  return this;
  // }

  /**
   * Sets the description of the help command.
   *
   * @example
   * helpCommand().setDescription("View each command!")
   *
   * @param description
   *    The description to set for the help command.
   * @returns
   *    A builder instance for configuring the help command.
   */
  setDescription(description: string) {
    this.state.description = description;
    makeHelpCommand(this.state);
    return this;
  }

  /**
   * Sets the aliases for the help command.
   *
   * @example
   * helpCommand().setAliases(["commands", "cmds"])
   *
   * @param aliases
   *    The aliases for the help command.
   * @returns
   *    A builder instance for configuring the help command.
   */
  setAliases(aliases: string[]) {
    this.state.aliases = aliases;
    makeHelpCommand(this.state);
    return this;
  }

  /**
   * Removes the help command if it exists. \
   * Overwiting the help command will also have the same effect.
   *
   * This is only necessary if you wish to completely remove the help command.
   */
  remove() {
    removeHelpCommandIfExists();
  }
}
