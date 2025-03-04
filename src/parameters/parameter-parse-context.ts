import type { Player } from "@minecraft/server";
import type { TokenStream } from "~/tokens";
import type { Parameter } from "./parameter";

export class ParameterParseContext<TParams extends Record<string, Parameter> = Record<string, Parameter>> {
  readonly player: Player;
  readonly message: string;
  readonly tokens: TokenStream;
  readonly params: TParams;

  constructor(player: Player, message: string, tokens: TokenStream, params: TParams) {
    this.player = player;
    this.message = message;
    this.tokens = tokens;
    this.params = params;
  }
}
