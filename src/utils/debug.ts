import { gray } from "@mhesus/mcbe-colors";
import { world } from "@minecraft/server";

/** @internal */
export function log(...args: any[]) {
  world.sendMessage(gray(args.map((arg) => `${arg}`).join(" ")));
}

/** @internal */
export interface DirOptions {
  maxDepth?: number;
}

/** @internal */
export function dir(object: any) {
  log(JSON.stringify(object, null, 2));
}

/** @internal */
export const debug = Object.freeze({ log, dir });
export default debug;
