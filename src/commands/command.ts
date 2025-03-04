import type { ChatSendBeforeEvent } from "@minecraft/server";

import type { TokenStream } from "~/tokens";
import { ParameterParseContext, type ParameterSignatureOptions } from "~/parameters";
import { ParseError } from "~/errors";

import { Overload } from "./overload";
import { CommandCollection } from "./command-collection";

export class Command<Overloads extends readonly Overload[] = readonly Overload[]> {
  parent?: Command;

  readonly subname: string;
  aliases: string[] = [];
  description?: string;
  overloads: Overloads;
  subcommands = new CommandCollection();

  constructor(subname: string, aliases: string[], overloads: Overloads) {
    this.subname = subname.trim();
    this.aliases = aliases;
    this.overloads = overloads;
  }

  get name(): string {
    if (this.parent) {
      return `${this.parent.name} ${this.subname}`;
    }

    return this.subname;
  }

  *descendants() {
    const queue = [...this.subcommands];

    let command: Command | undefined;
    while ((command = queue.shift())) {
      yield command;
      queue.push(...command.subcommands);
    }
  }

  getSignatures(options?: ParameterSignatureOptions) {
    return this.overloads.map((overload) => `${this.name} ${overload.getSignature(options)}`);
  }

  getInvokedOverload(
    event: ChatSendBeforeEvent,
    stream: TokenStream,
  ): { overload?: Overload; args: Record<string, any>; errors: Map<Overload, Error> } {
    let paramIdx = 0;
    let candidates = [...this.overloads];

    let errors = new Map<Overload, Error>();
    let args = new Map<Overload, unknown[]>(candidates.map((overload) => [overload, []]));

    // Each overload gets their own stream
    let streams = new Map<Overload, TokenStream>(candidates.map((overload) => [overload, stream.clone()]));

    while (candidates.length > 1) {
      const nextCandidates: Overload[] = [];

      errors.clear();

      for (const overload of candidates) {
        const param = Object.values(overload.parameters)[paramIdx];

        if (param === undefined) {
          errors.set(overload, new ParseError("Didn't expect more arguments."));
          continue;
        }

        const tokens = streams.get(overload)!;
        const context = new ParameterParseContext(event.sender, event.message, tokens, overload.parameters);

        try {
          args.get(overload)!.push(param.parse(context));
          nextCandidates.push(overload);
        } catch (err) {
          errors.set(overload, err);
          args.get(overload)!.length = 0; // clear args
        }
      }

      candidates = nextCandidates;
      paramIdx++;
    }

    const overload = candidates[0];
    stream.unparsed = streams.get(overload)!.unparsed;

    return {
      overload,
      args: args.get(overload)!,
      errors,
    };
  }
}

export type CommandOverloads<T extends Command> = T extends Command<infer Overloads> ? Overloads : never;
