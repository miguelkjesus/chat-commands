import { ParseError } from "~/errors";

import { ParameterParseTokenContext, ParameterParseValueContext } from "../parameter-parse-context";
import { Token } from "~/tokens";

// TODO introduce system for users to raise custom parameter errors
//      revamp parameter error system to show where the error happened in the input
//      (research how token parsers already do this cos idfk lol)

export abstract class Parameter<Value = any, TokenType = any> {
  typeName: string;

  id?: string;
  name?: string;
  description?: string;
  optional = false;

  constructor(name?: string) {
    this.name = name;
  }

  abstract parseToken(context: ParameterParseTokenContext): Token<TokenType>;
  abstract parseValue(context: ParameterParseValueContext<TokenType>): Value;

  parse(context: ParameterParseTokenContext): Token<Value | undefined> {
    if (context.stream.isEmpty()) {
      if (this.optional) return context.stream.token(undefined).from(0).length(0);
      throw context.stream
        .error(`Expected a${"aeiou".includes(this.typeName[0]) ? "n" : ""} ${this.typeName} parameter!`)
        .at(0).state;
    }

    const result = this.parseToken(context);
    const value = this.parseValue(
      new ParameterParseValueContext(context.player, context.message, context.params, result),
    );

    return result.map(() => value);
  }

  getSignature() {
    if (this.name === undefined) {
      throw new Error("Parameter has no name.");
    }

    if (!this.optional) return `<${this.name}: ${this.typeName}>`;

    return `[${this.name}: ${this.typeName}]`;
  }

  toString() {
    return this.getSignature();
  }
}

export type ParameterType<T extends Parameter> =
  T extends Parameter<infer Type, any> ? (T["optional"] extends true ? Type | undefined : Type) : never;

export type Arguments<T extends Record<string, Parameter>> = {
  [K in keyof T]: ParameterType<T[K]>;
};

export type ArgumentTokens<T extends Record<string, Parameter>> = {
  [K in keyof T]: Token<ParameterType<T[K]>>;
};
