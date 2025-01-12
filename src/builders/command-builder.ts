import { Player } from "@minecraft/server";
 
import { ValueOrContextualGetter } from "../utils/getters";
import { Builder } from "./builder";


export interface CommandInvocationContext {
  player: Player;
}

export interface Command {
  name: string;
  description?: ValueOrContextualGetter<string, CommandInvocationContext>;
  execute?: (context: CommandInvocationContext) => void;
}


export class CommandBuilder extends Builder<Command> {
  description(description: Command["description"]) {
    return this.add({ description });
  }
}

export function command(name: string) {
  return new CommandBuilder({ name })
    .description("")
}