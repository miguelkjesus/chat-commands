import { Command } from "./command";

export class CommandCollection {
  private commands = new Set<Command>();

  constructor(...commands: Command[]) {
    this.add(...commands);
  }

  *[Symbol.iterator]() {
    yield* this.commands;
  }

  toArray() {
    return [...this.commands];
  }

  get(name: string): Command | undefined {
    for (const command of this.commands) {
      if (command.name === name) {
        return command;
      }
    }
  }

  has(name: string): boolean {
    return this.get(name) !== undefined;
  }

  add(...commands: Command[]) {
    for (const command of commands) {
      const existing = this.get(command.name);
      if (existing) {
        console.warn(`Command "${command.name}" will overwrite the command of the same name.`);
        this.commands.delete(existing);
        continue;
      }

      this.commands.add(command);
    }
  }

  remove(...commands: Command[]) {
    for (const command of commands) {
      this.commands.delete(command);
    }
  }
}
