import type { ChatSendBeforeEvent, Player } from "@minecraft/server";

import type { Arguments, Parameter } from "~/parameters";
import type { Resolvable } from "~/utils/resolvers";

import type { Invocation } from "./invocation";
import { TokenStream } from "~/tokens";

export class Overload<const TParams extends Record<string, Parameter> = Record<string, Parameter>> {
  checks: Resolvable<(player: Player) => boolean>[] = []; // TODO:
  parameters: TParams;
  execute: ((ctx: Invocation<TParams>) => void) | undefined;

  constructor(parameters: TParams) {
    this.parameters = parameters;
  }

  getArguments(event: ChatSendBeforeEvent, tokens: TokenStream): Arguments<TParams> {
    // TODO
  }
}

export type OverloadParameters<T extends Overload> = T extends Overload<infer TParams> ? TParams : never;
