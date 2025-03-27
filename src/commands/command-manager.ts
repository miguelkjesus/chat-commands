import { ChatSendBeforeEvent, Player, world } from "@minecraft/server";
import { darkGray, gray, italic, red, white } from "@mhesus/mcbe-colors";

import { type Parameter, ParameterParseTokenContext } from "~/parameters";
import { ChatCommandError, ParseError } from "~/errors";
import { TokenStream, parsers } from "~/tokens";

import type { Command } from "./command";
import { CommandCollection } from "./command-collection";
import { Invocation } from "./invocation";
import { Overload } from "./overload";

export class CommandManager {
  prefix!: string;
  commands = new CommandCollection();

  private _isStarted = false;

  get isStarted() {
    return this._isStarted;
  }

  /**
   * Sets the prefix to be used for all commands and starts listening for chat commands. \
   * The prefix determines how commands are recognised when entered by players.
   *
   * This should be called at least once, somewhere in your script.
   *
   * @example
   * manager.start("!")
   * // The command manager will now recognise commands prefixed with "!" (e.g., "!teleport")
   *
   * @param prefix
   *    The prefix to be used for commands (e.g., "!", ";", or any other character sequence)
   *
   *    Prefixes **cannot** start with "/" because Minecraft's built-in commands already use it. \
   *    Prefixes **cannot** be undefined or empty.
   * @throws
   *    If the prefix starts with "/". \
   *    If the prefix is undefined or empty.
   */
  start(prefix: string): void {
    if (this.isStarted) return;

    this.assertValidPrefix(prefix);
    this.prefix = prefix;

    world.beforeEvents.chatSend.subscribe((event) => {
      try {
        this.processChatEvent(event);
      } catch (err) {
        if (!(err instanceof ChatCommandError)) throw err;
        event.sender.sendMessage(red(err.message));
      }
    });

    this._isStarted = true;
  }

  assertValidPrefix(prefix: string) {
    if (prefix === undefined) {
      throw new Error("Prefix cannot be undefined.");
    }

    if (prefix === "") {
      throw new Error("Prefix cannot be an empty string.");
    }

    if (prefix.startsWith("/")) {
      throw new Error('Prefix cannot start with "/"');
    }
  }

  protected async processChatEvent(event: ChatSendBeforeEvent) {
    if (!event.message.startsWith(this.prefix!)) return;

    event.cancel = true;
    event.sender.sendMessage(darkGray(`You executed: ${event.message}`));

    const [invocation, args] = this.getInvocation(event);

    try {
      invocation.overload.execute?.(invocation, args);
    } catch (err) {
      console.error(err);
      throw new ChatCommandError(
        "Uh oh! There was an unexpected error while running this command!\nPlease contact the behaviour pack owner",
      );
    }
  }

  private getInvocation(event: ChatSendBeforeEvent): [Invocation, Record<string, any>] {
    const stream = new TokenStream(event.message.slice(this.prefix!.length));
    const command = this.getInvokedCommand(stream, event.sender);
    const { overload, args } = this.getInvokedOverload(command, stream, event);
    return [new Invocation(this, event.sender, event.message, overload, command), args];
  }

  private getInvokedCommand(stream: TokenStream, player: Player): Command {
    const name = stream.pop(parsers.literal(...this.commands.usable(player).aliases()));
    const command = name !== undefined ? this.commands.get(name) : undefined;

    if (command === undefined) {
      const bestMatch = stream.pop(parsers.fuzzy(...this.commands.aliases()));

      throw new ParseError(
        [
          `Unknown command.`,
          bestMatch && `Did you mean ${white(this.prefix + bestMatch)}?`,
          `\nType ${white(this.prefix + "help")} for a list of commands!`,
        ]
          .filter((v) => v)
          .join(" "),
      );
    }

    return command!;
  }

  private getInvokedOverload(
    command: Command,
    stream: TokenStream,
    event: ChatSendBeforeEvent,
  ): { overload: Overload; args: Record<string, any> } {
    // TODO optimise so that
    let candidates = [command, ...command.getDescendantOverloads()].filter(
      (overload) => overload.execute !== undefined && (overload.canPlayerUse?.(event.sender) ?? true),
    );

    const overloadErrors = new Map<Overload, ChatCommandError>();
    const overloadArgs = new Map<Overload, Record<string, unknown>>(candidates.map((o) => [o, {}]));
    const overloadStreams = new Map<Overload, TokenStream>(candidates.map((o) => [o, stream.clone()]));

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
      overloadErrors.clear();
      const nextCandidates: Overload[] = [];
      const nextMatchedOverloads: Overload[] = [];

      for (const overload of candidates) {
        const stream = overloadStreams.get(overload)!;
        const args = overloadArgs.get(overload)!;
        const param: Parameter | undefined = Object.values(overload.parameters)[paramIdx];

        if (param) {
          try {
            args[param.id!] = param.parse(
              new ParameterParseTokenContext(event.sender, event.message, overload.parameters, stream),
            );
            nextCandidates.push(overload);
          } catch (err) {
            if (!(err instanceof ChatCommandError)) throw err;
            overloadErrors.set(overload, err);
            args.length = 0;
          }
        } else if (!stream.isEmpty()) {
          // no param and theres more tokens to be collected: too many args
          overloadErrors.set(overload, new ParseError("Too many arguments!"));
        } else {
          // no param and no more tokens: successfully matched
          nextMatchedOverloads.push(overload);
          candidates.slice(candidates.indexOf(overload), 1);
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

    throw this.overloadError(command, overloadErrors);
  }

  private overloadError(command: Command, errors: Map<Overload, Error>) {
    return new ParseError(
      [
        "Oops! The command had the following errors:",
        ...[...errors.entries()].flatMap(([overload, error]) =>
          overload
            .getSignatures()
            .map((signature) => [gray(`${this.prefix + command.name} ${signature}`), `  > ${italic(error.message)}`]),
        ),
        `\nType ${white(`${this.prefix}help ${command.name}`)} for help with this command!`,
      ]
        .filter((v) => v)
        .join("\n"),
    );
  }
}

export const manager = new CommandManager();
