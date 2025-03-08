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

  getInvokedOverload(
    event: ChatSendBeforeEvent,
    stream: TokenStream,
  ): { overload: Overload; args: Record<string, any> } | { errors: Map<Overload, Error> } {
    let candidates = [...this.overloads];

    const errors = new Map<Overload, Error>();
    const overloadArgs = new Map<Overload, Record<string, unknown>>(candidates.map((o) => [o, {}]));
    const streams = new Map<Overload, TokenStream>(candidates.map((o) => [o, stream.clone()]));

    // test for empty overload

    const emptyOverload = candidates.find((o) => Object.keys(o.parameters).length === 0);

    if (emptyOverload) {
      if (stream.isEmpty()) {
        return { overload: emptyOverload, args: {} };
      } else {
        candidates.splice(candidates.indexOf(emptyOverload), 1);
      }
    }

    // test for other overloads

    let paramIdx = 0;
    let matchedOverloads: Overload[] = [];

    while (candidates.length !== 0) {
      if (candidates.length === 0) {
        return { errors };
      }

      errors.clear();
      const nextCandidates: Overload[] = [];
      const nextMatchedOverloads: Overload[] = [];

      for (const overload of candidates) {
        const stream = streams.get(overload)!;
        const args = overloadArgs.get(overload)!;

        const param: Parameter | undefined = Object.values(overload.parameters)[paramIdx];
        const parseCtx = new ParameterParseTokenContext(event.sender, event.message, overload.parameters, stream);

        if (param) {
          try {
            args[param.id!] = param.parse(parseCtx);
            nextCandidates.push(overload);
          } catch (err) {
            errors.set(overload, err);
            args.length = 0;
          }
        } else if (!stream.isEmpty()) {
          // no param and theres more tokens to be collected: too many args
          errors.set(overload, new ParseError("Too many arguments!"));
        } else {
          // no param and no more tokens: successfully matched
          nextMatchedOverloads.push(overload);

          // return { overload, args };
        }
      }

      if (nextMatchedOverloads.length > 0) {
        matchedOverloads = nextMatchedOverloads;
      }

      candidates = nextCandidates;
      paramIdx++;
    }

    if (matchedOverloads.length > 0) {
      const overload = matchedOverloads[0];
      return { overload, args: overloadArgs.get(overload)! };
    }

    return { errors };
  }
}

export type CommandOverloads<T extends Command> = T extends Command<infer Overloads> ? Overloads : never;

export type CombinedOverloadParameters<Overloads extends readonly Overload[]> = {
  [K in keyof Overloads]: OverloadParameters<Overloads[K]>;
}[number];

export type MultipleInvocationCallback<Overloads extends readonly Overload[]> = InvocationCallback<
  CombinedOverloadParameters<Overloads>
>;
