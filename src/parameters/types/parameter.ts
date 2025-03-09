import { isCallable } from "~/utils/types";
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
  optional?: { defaultValue?: Value };

  checks: Check<Value>[] = [];

  constructor(name?: string) {
    this.name = name;
  }

  abstract parseToken(context: ParameterParseTokenContext): Token | undefined;
  abstract parseValue(context: ParameterParseValueContext<Token>): Value;
  validate(context: ParameterValidateContext<Value>) {}

  performChecks(value: Value) {
    for (const check of this.checks) {
      check.assert(value);
    }
  }

  parse(context: ParameterParseTokenContext): Value | undefined {
    const token = this.parseToken(context);

    if (token === undefined) {
      if (this.optional) {
        return this.optional.defaultValue;
      } else {
        throw new ParseError("This is a required parameter!");
      }
    } else {
      const value = this.parseValue(
        new ParameterParseValueContext(context.player, context.message, context.params, token),
      );
      this.validate(new ParameterValidateContext(context.player, context.message, context.params, value));
      this.performChecks(value);

      return value;
    }
  }

  getSignature(options?: ParameterSignatureOptions) {
    if (this.name === undefined) {
      throw new Error("Parameter has no name.");
    }

    if (!this.optional) return `<${this.name}: ${this.typeName}>`;

    if (options?.showDefaultValue && this.optional.defaultValue) {
      const defaultString = isCallable(this.optional.defaultValue) ? "..." : this.optional.defaultValue;
      return `[${this.name}: ${this.typeName} = ${defaultString}]`;
    }

    return `[${this.name}: ${this.typeName}]`;
  }
}

export interface ParameterSignatureOptions {
  showDefaultValue?: boolean;
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

export type ParameterType<T extends Parameter> = T extends Parameter<infer Type, any> ? Type : never;

export type Arguments<T extends Record<string, Parameter>> = {
  [K in keyof T]: ParameterType<T[K]>;
};
