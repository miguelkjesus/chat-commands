import type { Player } from "@minecraft/server";

import type { Arguments, Parameter } from "~/parameters";

import type { Invocation } from "./invocation";

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

  execute(...params: Parameters<ExecuteCallback<this>>) {
    return this.executeCallback?.(...params);
  }

  canPlayerUse(player: Player) {
    return this.canPlayerUseCallback?.(player) ?? true;
  }

  getSignatures(): string[] {
    const signatures = this.overloads.flatMap((overload) => overload.getSignatures());

    if (this.executeCallback !== undefined) {
      signatures.push([...Object.values(this.parameters)].map((param) => param.getSignature()).join(" "));
    }

    return signatures;
  }
}

// I would just infer Params, but TS throws a hissy fit with inferring the parameters of commands if you do lol.
export type OverloadParameters<T extends Overload> = T["parameters"];

export type OverloadArguments<T extends Overload> = Arguments<OverloadParameters<T>>;

export type ExecuteCallback<T extends Overload> = (
  ctx: Invocation<T>,
  args: OverloadArguments<T>,
) => void | Promise<void>;
