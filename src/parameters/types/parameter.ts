import { ParseError, ValueError } from "~/errors";

import {
  ParameterParseTokenContext,
  ParameterParseValueContext,
  ParameterValidateContext,
} from "../parameter-parse-context";

export abstract class Parameter<Value = any, Token = any> {
  typeName: string;

  id?: string;
  name?: string;
  description?: string;
  optional = false;

  checks: Check<Value>[] = [];

  constructor(name?: string) {
    this.name = name;
  }

  abstract parseToken(context: ParameterParseTokenContext): Token | undefined;
  abstract parseValue(context: ParameterParseValueContext<Token>): Value;
  validate(context: ParameterValidateContext<Value>) {}

  performChecks(value: Value) {
    this.checks.forEach((check) => check.assert(value));
  }

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
    this.performChecks(value);

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

export class Check<T> {
  test: (value: T) => boolean;
  errorMessage: string;

  constructor(callback: (value: T) => boolean, errorMessage: string) {
    this.test = callback;
    this.errorMessage = errorMessage;
  }

  assert(value: T) {
    if (!this.test(value)) {
      throw new ValueError(this.errorMessage);
    }
  }
}

export type ParameterType<T extends Parameter> =
  T extends Parameter<infer Type, any>
    ? T["optional"] extends { defaultValue: undefined }
      ? Type | undefined
      : Type
    : never;

export type Arguments<T extends Record<string, Parameter>> = {
  [K in keyof T]: ParameterType<T[K]>;
};
