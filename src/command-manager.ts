import { world } from "@minecraft/server";
import { CommandBuilder } from "./builders/command-builder";
import { Invocation } from "./command";

export class CommandManager {
  prefix = "";
  private commands: CommandBuilder[] = [];
}
