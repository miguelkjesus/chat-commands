import { ParseError } from "~/errors";

import {
  ParameterParseTokenContext,
  ParameterParseValueContext,
  ParameterValidateContext,
} from "../parameter-parse-context";

// TODO introduce system for users to raise custom parameter errors
//      revamp parameter error system to show where the error happened in the input
//      (research how token parsers already do this cos idfk lol)

export abstract class Parameter<Value = any, Token = any> {
  typeName: string;

  id?: string;
  name?: string;
  description?: string;
  optional = false;

  constructor(name?: string) {
    this.name = name;
  }

  abstract parseToken(context: ParameterParseTokenContext): Token | undefined;
  abstract parseValue(context: ParameterParseValueContext<Token>): Value;
  validate(context: ParameterValidateContext<Value>) {}

  parse(context: ParameterParseTokenContext): Value | undefined {
    const token = this.parseToken(context);

    if (token === undefined) {
      if (this.optional) return;
      throw new ParseError("This is a required parameter!");
    }

    const value = this.parseValue(
      new ParameterParseValueContext(context.player, context.message, context.params, token),
    );
    this.validate(new ParameterValidateContext(context.player, context.message, context.params, value));

    return value;
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
