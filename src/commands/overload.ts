import type { Player } from "@minecraft/server";

import type { Resolvable } from "~/utils/resolvers";
import type { Arguments, Parameter, ParameterSignatureOptions } from "~/parameters";

import type { Invocation } from "./invocation";
import { Simplify } from "~/utils/types";

export class Overload<
  Params extends Record<string, Parameter> = Record<string, Parameter>,
  Overloads extends readonly Overload[] = readonly any[],
> {
  readonly parameters: Params;
  overloads: Overloads; // TODO

  checks: Resolvable<(player: Player) => boolean>[] = []; // TODO
  description?: string;

  execute?: InvocationCallback<Params>;

  constructor(parameters: Params, overloads: Overloads) {
    this.parameters = parameters;
    this.overloads = overloads;
  }

  getSignature(options?: ParameterSignatureOptions) {
    return [...Object.values(this.parameters)].map((param) => param.getSignature(options)).join(" ");
  }
}

export type OverloadParameters<T extends Overload> = T extends Overload<infer TParams> ? TParams : never;

export type InvocationCallback<Params extends Record<string, Parameter> = Record<string, Parameter>> = (
  ctx: Invocation,
  args: Simplify<Arguments<Params>>,
) => void;
