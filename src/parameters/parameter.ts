import { ParseError, ValueError } from "~/errors";
import {
  ParameterParseTokenContext,
  ParameterParseValueContext,
  ParameterValidateContext,
} from "./parameter-parse-context";
import { isCallable } from "~/utils/types";

export abstract class Parameter<TValue = any, TToken = any> {
  typeName: string;

  id?: string;
  name?: string;
  description?: string;
  optional?: { defaultValue?: TValue };

  checks: Check<TValue>[] = [];

  constructor(name?: string) {
    this.name = name;
  }

  abstract parseToken(context: ParameterParseTokenContext): TToken | undefined;
  abstract parseValue(context: ParameterParseValueContext<TToken>): TValue;
  validate(context: ParameterValidateContext<TValue>) {}

  performChecks(value: TValue) {
    for (const check of this.checks) {
      check.assert(value);
    }
  }

  parse(context: ParameterParseTokenContext): TValue | undefined {
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

export type ParameterType<T extends Parameter> = T extends Parameter<infer Type> ? Type : never;

export type Arguments<T extends Record<string, Parameter>> = {
  [K in keyof T as undefined extends ParameterType<T[K]> ? never : K]: ParameterType<T[K]>;
};
