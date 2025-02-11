import { Command } from "./command";

export class CommandCollection {
  private commands = new Set<Command>();

  *[Symbol.iterator]() {
    yield* this.commands;
  }

  toArray() {
    return [...this.commands];
  }

  add(...commands: Command[]) {
    for (const command of commands) {
      this.commands.add(command);
    }
  }

  remove(...commands: Command[]) {
    for (const command of commands) {
      this.commands.delete(command);
    }
  }
}
