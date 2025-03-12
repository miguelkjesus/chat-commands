import { ChatSendBeforeEvent, world } from "@minecraft/server";
import { darkGray, gold, gray, italic, red, white } from "@mhesus/mcbe-colors";

import { type Parameter, ParameterParseTokenContext } from "~/parameters";
import { fuzzySearch, joinTruthy } from "~/utils/string";
import { ChatCommandError, ParseError } from "~/errors";
import { TokenStream, parsers } from "~/tokens";

import type { Command } from "./command";
import { CommandCollection } from "./command-collection";
import { Invocation } from "./invocation";
import { Overload } from "./overload";

export class CommandManager {
  prefix?: string;
  commands = new CommandCollection();

  start(): void {
    if (this.prefix === undefined) return;
    world.beforeEvents.chatSend.subscribe((event) => {
      try {
        this.processEvent(event);
      } catch (err) {
        if (!(err instanceof ChatCommandError)) throw err;
        event.sender.sendMessage(red(err.message));
      }
    });
  }

  protected processEvent(event: ChatSendBeforeEvent) {
    if (!event.message.startsWith(this.prefix!)) return;

    event.cancel = true;
    event.sender.sendMessage(darkGray(`You executed: ${event.message}`));

    const [invocation, args] = this.getInvocation(event);

    try {
      invocation.command.beforeExecute?.(invocation, args);
      invocation.overload.execute?.(invocation, args);
      invocation.command.afterExecute?.(invocation, args);
    } catch (err) {
      console.error(err);
      throw new ChatCommandError(
        "Uh oh! There was an unexpected error while running this command!\nPlease contact the behaviour pack owner",
      );
    }
  }

  private getInvocation(event: ChatSendBeforeEvent): [Invocation, Record<string, any>] {
    const stream = new TokenStream(event.message.slice(this.prefix!.length));
    const command = this.getInvokedCommand(stream);
    const { overload, args } = this.getInvokedOverload(command, stream, event);
    return [new Invocation(this, event.sender, event.message, overload, command), args];
  }

  private getInvokedCommand(stream: TokenStream): Command {
    const name = stream.pop(parsers.literal(...this.commands.aliases()));
    const command = name !== undefined ? this.commands.get(name) : undefined;

    if (command === undefined) {
      const bestMatch = stream.pop(parsers.fuzzy(...this.commands.aliases()));

      throw new ParseError(
        joinTruthy(" ", [
          `Unknown command.`,
          bestMatch && `Did you mean ${white(this.prefix + bestMatch)}?`,
          `\nType ${white(this.prefix + "help")} for a list of commands!`,
        ]),
      );
    }

    return command!;
  }

  private getInvokedOverload(
    command: Command,
    stream: TokenStream,
    event: ChatSendBeforeEvent,
  ): { command: Command; overload: Overload; args: Record<string, any> } {
    let candidates = [...command.overloads];

    const errors = new Map<Overload, Error>();
    const overloadArgs = new Map<Overload, Record<string, unknown>>(candidates.map((o) => [o, {}]));
    const streams = new Map<Overload, TokenStream>(candidates.map((o) => [o, stream.clone()]));

    // test for empty overload

    const emptyOverload = candidates.find((o) => Object.keys(o.parameters).length === 0);

    if (emptyOverload) {
      if (stream.isEmpty()) {
        return { command, overload: emptyOverload, args: {} };
      } else {
        candidates.splice(candidates.indexOf(emptyOverload), 1);
      }
    }

    // test for other overloads

    let paramIdx = 0;
    let matchedOverloads: Overload[] = [];

    while (candidates.length !== 0) {
      if (candidates.length === 0) {
        throw this.overloadError(command, errors);
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
      return { command, overload, args: overloadArgs.get(overload)! };
    }

    throw this.overloadError(command, errors);
  }

  private overloadError(command: Command, errors: Map<Overload, Error>) {
    return new ParseError(
      joinTruthy("\n", [
        "Command errored in the following overloads:",
        ...[...errors.entries()].flatMap(([overload, error]) => {
          if (!(error instanceof ParseError)) throw error;
          return [gray(`${this.prefix + command.name} ${overload.getSignature()}`), `  > ${italic(error.message)}`];
        }),
        `\nType ${white(this.prefix + "help teleport")} for help with this command!`,
      ]),
    );
  }
}

export const manager = new CommandManager();
