import { ParseError } from "~/errors";
import type { ParameterParseContext } from "./parameter-parse-context";
import { isCallable } from "~/utils/types";

export abstract class Parameter<T = any> {
  typeName: string;

  id?: string;
  name?: string;
  description?: string;
  optional?: { defaultValue?: T };

  checks: Check<T>[] = [];

  constructor(name?: string) {
    this.name = name;
  }

  abstract parse(context: ParameterParseContext): T;

  validate(value: T) {
    this.performChecks(value);
  }

  performChecks(value: T) {
    for (const check of this.checks) {
      check.assert(value);
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
      throw new ParseError(this.errorMessage);
    }
  }
}

export type ParameterType<T extends Parameter> = T extends Parameter<infer Type> ? Type : never;

export type Arguments<T extends Record<string, Parameter>> = { [K in keyof T]: ParameterType<T[K]> };
