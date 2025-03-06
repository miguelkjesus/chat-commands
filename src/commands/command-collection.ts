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

  get(nameOrAlias: string): Command | undefined {
    for (const command of this.commands) {
      if (command.name === nameOrAlias || command.aliases.includes(nameOrAlias)) {
        return command;
      }
    }
  }

  has(name: string): boolean {
    return this.get(name) !== undefined;
  }

  add(...commands: Command[]) {
    for (const command of commands) {
      if (this.get(command.name)) {
        throw new Error(`Command "${command.name}" has the same name or alias as another command.`);
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
