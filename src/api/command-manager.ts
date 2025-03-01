import { CommandManager } from "~/commands";

export const manager = new CommandManager();

export function prefix(value: string) {
  manager.prefix = value;
}

export function start() {
  manager.start();
}
