import { CommandManager } from "~/commands";

export const commandManager = new CommandManager();

export function prefix(value: string) {
  commandManager.prefix = value;
}

export function start() {
  commandManager.listen();
}
