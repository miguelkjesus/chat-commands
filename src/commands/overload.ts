import type { Player } from "@minecraft/server";

import type { Arguments, Parameter } from "~/parameters";

import type { Invocation } from "./invocation";

export class Overload<Params extends Record<string, Parameter> = Record<string, Parameter>> {
  readonly parameters: Params;
  overloads: Overload[]; // Making this a generic type results in: Type instantiation is excessively deep and possibly infinite
  description?: string;

  canPlayerUse?: (player: Player) => boolean;
  execute?: ExecuteCallback<this>;

  constructor(parameters: Params, overloads: Overload[]) {
    this.parameters = parameters;
    this.overloads = overloads;
  }

  getSignatures(): string[] {
    const signatures = this.overloads.flatMap((overload) => overload.getSignatures());

    if (this.execute !== undefined) {
      signatures.push([...Object.values(this.parameters)].map((param) => param.getSignature()).join(" "));
    }

    return signatures;
  }

  getDescendantOverloads(): Overload[] {
    return [...this.overloads, ...this.overloads.flatMap((overload) => overload.getDescendantOverloads())];
  }
}

export type OverloadParameters<T extends Overload> = T extends Overload<infer TParams> ? TParams : never;

export type OverloadArguments<T extends Overload> = Arguments<OverloadParameters<T>>;

export type ExecuteCallback<T extends Overload> = (
  ctx: Invocation<T>,
  args: OverloadArguments<T>,
) => void | Promise<void>;
