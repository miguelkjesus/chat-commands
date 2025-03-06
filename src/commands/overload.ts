import type { Player } from "@minecraft/server";

import type { Resolvable } from "~/utils/resolvers";
import type { Arguments, Parameter, ParameterSignatureOptions } from "~/parameters";

import type { Invocation } from "./invocation";

export class Overload<
  TParams extends Record<string, Parameter> = Record<string, Parameter>,
  TOverload extends readonly Overload[] = readonly any[],
> {
  readonly parameters: TParams;
  overloads: TOverload;

  checks: Resolvable<(player: Player) => boolean>[] = []; // TODO:
  description?: string;

  execute: ((ctx: Invocation<TParams>, args: Arguments<TParams>) => void) | undefined;

  constructor(parameters: TParams, overloads: TOverload) {
    this.parameters = parameters;
    this.overloads = overloads;
  }

  getSignature(options?: ParameterSignatureOptions) {
    return [...Object.values(this.parameters)].map((param) => param.getSignature(options)).join(" ");
  }
}

export type OverloadParameters<T extends Overload> = T extends Overload<infer TParams> ? TParams : never;
