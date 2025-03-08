import { CommandBuilder } from "~/builders";
import { Command, manager } from "~/commands";
import { tokenize } from "~/tokens";

export function command(name: string, ...aliases: string[]) {
  const tokens = tokenize(name);
  if (tokens.length > 1) {
    throw new Error("Command names must have no spaces!");
    // TODO: Potentially avoid this by using command names directly in the tokenizer?
    // e.g. commands = [help, foo bar, teleport], it would try match each string in its entirety before just matching a string
  }

  const builder = new CommandBuilder(new Command(name, aliases, []));
  manager.commands.add(builder.state);
  return builder;
}
