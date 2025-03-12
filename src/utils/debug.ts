import { gray } from "@mhesus/mcbe-colors";
import { world } from "@minecraft/server";

export function log(...args: any[]) {
  world.sendMessage(gray(args.map((arg) => `${arg}`).join(" ")));
}

export interface DirOptions {
  maxDepth?: number;
}

export function dir(object: any) {
  log(JSON.stringify(object, null, 2));
}

export const debug = Object.freeze({ log, dir });
export default debug;
