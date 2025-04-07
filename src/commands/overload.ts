import type { Player } from "@minecraft/server";

import type { Arguments, Parameter } from "~/parameters";

import type { Invocation } from "./invocation";
import { Command } from "./command";

// TODO cooldowns

export class Overload<Params extends Record<string, Parameter> = Record<string, Parameter>> {
  readonly parameters: Params;
  readonly parent?: Overload;
  overloads: Overload[] = [];
  description?: string;

  canPlayerUseCallback?: (player: Player) => boolean;
  executeCallback?: ExecuteCallback<this>;

  constructor(parameters: Params, parent?: Overload) {
    this.parameters = parameters;
    this.parent = parent;
  }

  get command(): Command | undefined {
    if (this.parent === undefined) {
      if (this instanceof Command) return this;
      return undefined;
    }

    return this.parent.command;
  }

  execute(...params: Parameters<ExecuteCallback<this>>) {
    return this.executeCallback?.(...params);
  }

  canPlayerUse(player: Player) {
    return this.canPlayerUseCallback?.(player) ?? true;
  }

  getSignature(): string {
    return [this.command?.name, ...Object.values(this.parameters).map((param) => param.getSignature())]
      .filter((v) => v !== undefined)
      .join(" ");
  }

  getAllOverloads(): Overload[] {
    return [...this.overloads, ...this.overloads.flatMap((overload) => overload.getAllOverloads())];
  }
}

// I would just infer Params, but TS throws a hissy fit with inferring the parameters of commands if you do lol.
export type OverloadParameters<T extends Overload> = T["parameters"];

export type OverloadArguments<T extends Overload> = Arguments<OverloadParameters<T>>;

export type ExecuteCallback<T extends Overload> = (
  ctx: Invocation<T>,
  args: OverloadArguments<T>,
) => void | Promise<void>;
