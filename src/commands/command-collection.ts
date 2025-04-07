import { Player } from "@minecraft/server";
import { Command } from "./command";

export class CommandCollection {
  private commands = new Set<Command>();
  private aliasMap = new Map<string, Command>();

  constructor(...commands: Command[]) {
    this.add(...commands);
  }

  get size() {
    return this.commands.size;
  }

  *[Symbol.iterator]() {
    yield* this.commands;
  }

  names() {
    return this.values().map((command) => command.name);
  }

  aliases() {
    return [...this.aliasMap.keys()];
  }

  values() {
    return [...this.commands];
  }

  get(alias?: string): Command | undefined {
    return alias !== undefined ? this.aliasMap.get(alias) : undefined;
  }

  has(alias?: string): boolean {
    return alias !== undefined ? this.aliasMap.has(alias) : false;
  }

  add(...commands: Command[]) {
    for (const command of commands) {
      if (this.get(command.name)) {
        throw new Error(`Command "${command.name}" has the same name or alias as another command.`);
      }

      this.commands.add(command);
      this.aliasMap.set(command.name, command);
      for (const alias of command.aliases) {
        this.aliasMap.set(alias, command);
      }
    }
  }

  delete(...commands: Command[]) {
    for (const command of commands) {
      this.commands.delete(command);
      this.aliasMap.delete(command.name);
      for (const alias of command.aliases) {
        this.aliasMap.delete(alias);
      }
    }
  }

  clear() {
    this.commands.clear();
  }

  forEach(callback: (command: Command, collection: this) => void) {
    this.commands.forEach((command) => callback(command, this));
  }

  usableBy(player: Player): CommandCollection {
    return new CommandCollection(...[...this].filter((command) => command.canPlayerUseCallback?.(player) ?? true));
  }
}
