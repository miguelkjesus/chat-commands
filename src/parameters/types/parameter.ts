import { ParseError } from "~/errors";

import {
  ParameterParseTokenContext,
  ParameterParseValueContext,
  ParameterValidateContext,
} from "../parameter-parse-context";
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
  validate(context: ParameterValidateContext<Value>) {}

  parse(context: ParameterParseTokenContext): Token<Value | undefined> {
    if (context.stream.isEmpty()) {
      if (this.optional) return context.stream.token(undefined).from(0).length(0);
      throw new ParseError(`"${this.name}" is a required parameter!`);
    }

    const result = this.parseToken(context);
    const value = this.parseValue(
      new ParameterParseValueContext(context.player, context.message, context.params, result),
    );
    this.validate(new ParameterValidateContext(context.player, context.message, context.params, value));

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
