import { gray } from "@mhesus/mcbe-colors";
import { world } from "@minecraft/server";

const enabled = true;

export function log(...args: any[]) {
  if (!enabled) return;
  world.sendMessage(gray(args.map((arg) => `${arg}`).join(" ")));
}

export interface DirOptions {
  maxDepth?: number;
}

export function dir(object: any) {
  if (!enabled) return;
  log(JSON.stringify(object, null, 2));
}

export const debug = { log, dir, enabled };
export default debug;
