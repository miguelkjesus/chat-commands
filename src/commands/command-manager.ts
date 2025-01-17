import type { CommandBuilder } from "../builders/command-builder";

export class CommandManager {
  prefix = "";
  private commands: CommandBuilder[] = [];
}
