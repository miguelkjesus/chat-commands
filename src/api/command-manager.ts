import { manager } from "~/commands";

/**
 * Sets the prefix to be used for all commands and starts listening for commands input. \
 * The prefix determines how commands are recognised when entered by players.
 *
 * This should be called **after** defining all commands.
 *
 * @example
 * startWithPrefix("!")
 * // The command manager will now recognised commands prefixed with "!" (e.g., "!teleport")
 *
 * @param prefix
 *    The prefix to be used for commands (e.g., "!", ";", or any other character sequence) \
 *    Prefixes **cannot** start with "/" because Minecraft's built-in commands already use it.
 * @throws
 *    If the prefix starts with "/".
 */
export function startWithPrefix(prefix: string) {
  if (prefix.startsWith("/")) {
    throw new Error('Prefixes cannot start with "/"');
  }

  manager.prefix = prefix;
  manager.start();
}
