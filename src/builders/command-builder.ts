import { type Command } from "~/commands";

import { OverloadBuilder } from "./overload-builder";

// TODO figure out how to make `command()` a link

/**
 * A builder for configuring commands.
 *
 * Commands **should not** be created this way. Instead use `command()`.
 *
 * @template Overloads
 *    The overload definitions for the command.
 */
export class CommandBuilder extends OverloadBuilder<Command> {
  /**
   * Sets aliases for the command, allowing it to be invoked using alternative names.
   *
   * @example
   * command("teleport")
   *   .setAliases("tp", "warp", "goto");
   *
   * // This is equivalent
   * command("teleport", "tp", "warp", "goto")
   *
   * @param aliases
   *    Alternative names for the command.
   * @returns
   *    The command builder instance.
   */
  setAliases(...aliases: string[]) {
    this.state.aliases = aliases;
    return this;
  }
}
