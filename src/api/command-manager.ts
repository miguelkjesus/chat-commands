import { manager } from "~/commands";

export function prefix(value: string) {
  manager.prefix = value;
}

export function start() {
  manager.start();
}
