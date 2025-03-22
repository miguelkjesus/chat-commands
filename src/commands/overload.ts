import type { Player } from "@minecraft/server";

import type { Resolvable } from "~/utils/resolvers";
import type { Arguments, Parameter } from "~/parameters";

import type { Invocation } from "./invocation";

export class Overload<
  Params extends Record<string, Parameter> = Record<string, Parameter>,
  const Overloads extends Overload[] = any[],
> {
  readonly parameters: Params;
  overloads: Overloads; // TODO

  checks: Resolvable<(player: Player) => boolean>[] = []; // TODO
  description?: string;

  execute?: InvocationCallback<this>;

  constructor(parameters: Params, overloads: Overloads) {
    this.parameters = parameters;
    this.overloads = overloads;
  }

  getSignature() {
    return [...Object.values(this.parameters)].map((param) => param.getSignature()).join(" ");
  }
}

export type OverloadParameters<T extends Overload> = T extends Overload<infer TParams> ? TParams : never;

export type OverloadArguments<T extends Overload> = Arguments<OverloadParameters<T>>;

export type InvocationCallback<T extends Overload> = (ctx: Invocation<T>, args: OverloadArguments<T>) => void;
