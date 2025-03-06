import type { Player } from "@minecraft/server";
import type { TokenStream } from "~/tokens";
import type { Parameter } from "./parameter";

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

export class ParameterParseValueContext<TToken> extends ParameterParseContext {
  readonly token: TToken;

  constructor(player: Player, message: string, params: Record<string, Parameter>, token: TToken) {
    super(player, message, params);
    this.token = token;
  }
}

export class ParameterParseTokenContext extends ParameterParseContext {
  readonly tokens: TokenStream;

  constructor(player: Player, message: string, params: Record<string, Parameter>, tokens: TokenStream) {
    super(player, message, params);
    this.tokens = tokens;
  }
}

export class ParameterValidateContext<TValue> extends ParameterParseContext {
  readonly value: TValue;

  constructor(player: Player, message: string, params: Record<string, Parameter>, value: TValue) {
    super(player, message, params);
    this.value = value;
  }
}
