import { type ChatSendBeforeEvent, type Player, world } from "@minecraft/server";
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

    const { invocation, args } = this.getInvocation(event);

    try {
      invocation.overload.execute(invocation, args);
    } catch (err) {
      console.error(err);
      throw new ChatCommandError(
        "Uh oh! There was an unexpected error while running this command!\nPlease contact the behaviour pack owner",
      );
    }
  }

  private getInvocation(event: ChatSendBeforeEvent): InvocationResult {
    const stream = this.createTokenStream(event.message);
    const command = this.getInvokedCommand(stream, event.sender);
    const result = this.getInvokedOverload(command, stream, event);

    return {
      invocation: new Invocation(this, event.sender, event.message, result.overload, command),
      args: result.args,
    };
  }

  createTokenStream(message: string) {
    return new TokenStream(message.slice(this.prefix!.length));
  }

  private getInvokedCommand(stream: TokenStream, player: Player): Command {
    // Get the invoked command
    const usableAliases = this.commands.usable(player).aliases();
    const alias = stream.pop(parsers.literal(usableAliases));
    const command = this.commands.get(alias);

    // Error if command not recognised
    if (command === undefined) {
      const bestMatch = stream.pop(parsers.fuzzy(usableAliases));

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

    return command;
  }

  private getInvokedOverload(
    command: Command,
    stream: TokenStream,
    event: ChatSendBeforeEvent,
  ): OverloadSelectionResult {
    let candidates = [new OverloadSelectionCandidate(command, stream)];
    const errors = new Map<OverloadSelectionCandidate, ChatCommandError>();

    while (candidates.length !== 0) {
      const nextCandidates: OverloadSelectionCandidate[] = [];

      for (const candidate of candidates) {
        const param = candidate.remainingParameters.pop();

        if (param) {
          try {
            candidate.args[param.id!] = param.parse(
              new ParameterParseTokenContext(event.sender, event.message, candidate.overload.parameters, stream),
            );
            nextCandidates.push(candidate);
          } catch (err) {
            if (!(err instanceof ChatCommandError)) throw err;
            errors.set(candidate, err);
          }
        } else if (!candidate.stream.isEmpty()) {
          const candidateOverloads = candidate.overload.overloads;

          if (candidateOverloads) {
            nextCandidates.push(...candidateOverloads.map((overload) => candidate.createChild(overload)));
          } else {
            errors.set(candidate, new ParseError("Too many arguments!"));
          }
        } else {
          // currently, the first matched candidate is returned.
          // should parameters have a precedence?
          return candidate.toResult();
        }
      }
    }

    throw this.candidateSelectionError(command, errors);
  }

  private candidateSelectionError(command: Command, errors: Map<OverloadSelectionCandidate, Error>) {
    return new ParseError(
      [
        "Oops! The command couldn't be executed due to the following errors:",
        ...[...errors.entries()].flatMap(([candidate, error]) =>
          candidate.overload
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

class OverloadSelectionCandidate {
  stream: TokenStream;
  overload: Overload;
  remainingParameters: Parameter[];
  args: Record<string, unknown>;

  constructor(overload: Overload, stream: TokenStream) {
    this.stream = stream;
    this.overload = overload;
    this.remainingParameters = Object.values(overload.parameters);
    this.args = {};
  }

  createChild(overload: Overload): OverloadSelectionCandidate {
    const child = new OverloadSelectionCandidate(overload, this.stream);
    child.args = { ...this.args };
    return child;
  }

  toResult(): OverloadSelectionResult {
    return {
      overload: this.overload,
      args: this.args,
    };
  }
}

interface OverloadSelectionResult {
  overload: Overload;
  args: Record<string, unknown>;
}

interface InvocationResult {
  invocation: Invocation;
  args: Record<string, unknown>;
}

export const manager = new CommandManager();
