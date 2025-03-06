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

  get(alias: string): Command | undefined {
    return this.aliasMap.get(alias);
  }

  has(alias: string): boolean {
    return this.aliasMap.has(alias);
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
}
