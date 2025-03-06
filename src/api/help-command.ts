import { HelpCommandBuilder } from "~/builders";
import { makeHelpCommand } from "~/commands";

makeHelpCommand();

export function helpCommand() {
  return new HelpCommandBuilder({});
}
