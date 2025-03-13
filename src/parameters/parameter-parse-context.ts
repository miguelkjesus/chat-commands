import type { Player } from "@minecraft/server";
import { parsers, type TokenStream } from "~/tokens";
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

export class ParameterParseValueContext<Token> extends ParameterParseContext {
  readonly token: Token;

  constructor(player: Player, message: string, params: Record<string, Parameter>, token: Token) {
    super(player, message, params);
    this.token = token;
  }
}

export class ParameterParseTokenContext extends ParameterParseContext {
  readonly tokens: TokenStream;
  readonly parsers = parsers;

  constructor(player: Player, message: string, params: Record<string, Parameter>, tokens: TokenStream) {
    super(player, message, params);
    this.tokens = tokens;
  }
}

export class ParameterValidateContext<Value> extends ParameterParseContext {
  readonly value: Value;

  constructor(player: Player, message: string, params: Record<string, Parameter>, value: Value) {
    super(player, message, params);
    this.value = value;
  }
}
