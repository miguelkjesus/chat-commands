import type { Player } from "@minecraft/server";

import type { Resolvable } from "~/utils/resolvers";
import type { Arguments, Parameter, ParameterSignatureOptions } from "~/parameters";

import type { Invocation } from "./invocation";

export class Overload<TParams extends Record<string, Parameter> = Record<string, Parameter>> {
  readonly parameters: TParams;
  checks: Resolvable<(player: Player) => boolean>[] = []; // TODO:
  execute: ((ctx: Invocation<TParams>, args: Arguments<TParams>) => void) | undefined;

  constructor(parameters: TParams) {
    this.parameters = parameters;
  }

  getSignature(options?: ParameterSignatureOptions) {
    return Object.values(this.parameters)
      .map((param) => param.getSignature(options))
      .join(" ");
  }
}

export type OverloadParameters<T extends Overload> = T extends Overload<infer TParams> ? TParams : never;
