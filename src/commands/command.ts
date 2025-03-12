import type { ChatSendBeforeEvent } from "@minecraft/server";

import type { TokenStream } from "~/tokens";
import { ParameterParseTokenContext, Parameter, ParameterSignatureOptions } from "~/parameters";
import { ParseError } from "~/errors";

import { InvocationCallback, Overload, OverloadParameters } from "./overload";

export class Command<Overloads extends readonly Overload[] = readonly Overload[]> {
  name: string;
  aliases: string[] = [];
  description?: string;
  overloads: Overloads;

  beforeExecute?: MultipleInvocationCallback<Overloads>;
  afterExecute?: MultipleInvocationCallback<Overloads>;

  constructor(name: string, aliases: string[], overloads: Overloads) {
    this.name = name;
    this.aliases = aliases;
    this.overloads = overloads;
  }

  getSignatures(options?: ParameterSignatureOptions) {
    return this.overloads.map((overload) => `${this.name} ${overload.getSignature(options)}`);
  }
}

export type CommandOverloads<T extends Command> = T extends Command<infer Overloads> ? Overloads : never;

export type CombinedOverloadParameters<Overloads extends readonly Overload[]> = {
  [K in keyof Overloads]: OverloadParameters<Overloads[K]>;
}[number];

export type MultipleInvocationCallback<Overloads extends readonly Overload[]> = InvocationCallback<
  CombinedOverloadParameters<Overloads>
>;
