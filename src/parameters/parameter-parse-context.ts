import type { Player } from "@minecraft/server";
import { Token, type TokenSubstream } from "~/tokens";
import type { Parameter } from "./types/parameter";

export abstract class ParameterParseContext {
  readonly player: Player;
  readonly message: string;
  readonly params: Record<string, Parameter>;

  constructor(player: Player, message: string, params: Record<string, Parameter>) {
    this.player = player;
    this.message = message;
    this.params = params;
  }
}

export class ParameterParseValueContext<T> extends ParameterParseContext {
  readonly token: Token<T>;

  constructor(player: Player, message: string, params: Record<string, Parameter>, tokenResult: Token<T>) {
    super(player, message, params);
    this.token = tokenResult;
  }
}

export class ParameterParseTokenContext extends ParameterParseContext {
  readonly stream: TokenSubstream;

  constructor(player: Player, message: string, params: Record<string, Parameter>, stream: TokenSubstream) {
    super(player, message, params);
    this.stream = stream;
  }
}
