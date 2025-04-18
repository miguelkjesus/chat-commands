import type { ChatSendAfterEvent } from "@minecraft/server";

import { Command, CommandManager, Invocation, Overload } from "~/commands";
import { ChatCommandError, ParseError, TokenParseError } from "~/errors";
import { Parameter, ParameterParseTokenContext } from "~/parameters";

import type { TokenSubstream } from "../stream";
import { Token, TokenParser } from "../token";

import { Style } from "@mhesus/mcbe-colors";
import { FuzzyParser } from "./fuzzy-parser";
import { LiteralParser } from "./literal-parser";

export interface ParsedCommand {
  invocation: Invocation;
  args: Record<string, unknown>;
}

export class CommandParser extends TokenParser<ParsedCommand | undefined> {
  readonly commandManager: CommandManager;
  readonly event: ChatSendAfterEvent;

  constructor(commandManager: CommandManager, event: ChatSendAfterEvent) {
    super();
    this.commandManager = commandManager;
    this.event = event;
  }

  parse(stream: TokenSubstream): Token<ParsedCommand | undefined> {
    if (!this.isCommandMessage(stream)) return stream.token(undefined);

    const commandToken = this.parseCommand(stream);
    const { overload, argumentTokens } = this.parseOverload(stream, commandToken.value);

    const lastPosition = Object.values(argumentTokens).reduce(
      (last, token) => (token.endPosition > last ? token.endPosition : last),
      0,
    );

    return stream
      .token({
        invocation: new Invocation(
          this.commandManager,
          this.event.sender,
          this.event.message,
          overload,
          argumentTokens,
          commandToken.value,
        ),
        args: Object.fromEntries(Object.entries(argumentTokens).map(([key, token]) => [key, token.value])),
      })
      .to(lastPosition);
  }

  private isCommandMessage(stream: TokenSubstream): boolean {
    try {
      stream.pop(new LiteralParser([this.commandManager.prefix]));
      return true;
    } catch (e) {
      if (!(e instanceof ChatCommandError)) throw e;
      return false;
    }
  }

  private parseCommand(stream: TokenSubstream): Token<Command> {
    const { commands, prefix } = this.commandManager;

    const usableAliases = commands.usableBy(this.event.sender).aliases();

    try {
      const aliasToken = stream.pop(new LiteralParser(usableAliases, "Unknown command."));
      const command = commands.get(aliasToken.value)!;
      return aliasToken.map(() => command);
    } catch (e) {
      if (!(e instanceof ChatCommandError)) throw e;

      const bestMatchToken = stream.pop(new FuzzyParser(usableAliases));
      const suggestion = bestMatchToken.value ? ` Did you mean ${Style.white(prefix + bestMatchToken.value)}?` : "";
      throw bestMatchToken.error(
        `Unknown command.${suggestion}\nType ${Style.white(prefix + "help")} for a list of commands!`,
      ).state;
    }
  }

  private parseOverload(stream: TokenSubstream, command: Command): OverloadSelectionResult {
    let currentCandidates = [new OverloadSelectionCandidate(command, stream.clone())];
    let candidateErrors = new Map<OverloadSelectionCandidate, { paramIdx: number; error: ChatCommandError }>();

    let mostRecentResult: OverloadSelectionResult | undefined;

    while (currentCandidates.length > 0) {
      if (candidateErrors.size > 0) {
        // Filter out errors from candidates that have already failed
        candidateErrors = new Map([...candidateErrors].filter(([candidate]) => currentCandidates.includes(candidate)));
      }

      const nextCandidates: OverloadSelectionCandidate[] = [];

      for (const candidate of currentCandidates) {
        const result = this.processCandidate({ candidate, nextCandidates, candidateErrors });
        if (result) mostRecentResult = result; // Found a successful match
      }

      currentCandidates = nextCandidates;
    }

    if (mostRecentResult) {
      return mostRecentResult;
    }

    // No successful match found, throw a combined error
    this.handleNoMatch(command, candidateErrors);
  }

  private processCandidate(ctx: ProcessCandidateContext): OverloadSelectionResult | undefined {
    let { candidate, nextCandidates, candidateErrors } = ctx;

    const param = candidate.remainingParameters.shift();
    const overloads = candidate.overload.overloads;

    if (param) {
      this.parseParameter(ctx, param);
      return;
    }

    if (!candidate.stream.isEmpty() && !overloads.length) {
      candidate.stream.skipWhitespace();
      candidateErrors.set(candidate, {
        paramIdx: Object.values(candidate.overload.parameters).length - 1,
        error: candidate.stream.error("Too many parameters!").state,
      });
      return;
    }

    if (candidate.overload.hasExecuteCallback) {
      return candidate.toResult();
    }

    nextCandidates.push(...overloads.map((overload) => candidate.createChild(overload)));
  }

  private parseParameter({ candidate, nextCandidates, candidateErrors }: ProcessCandidateContext, param: Parameter) {
    try {
      candidate.argumentTokens[param.id!] = param.parse(
        new ParameterParseTokenContext(
          this.event.sender,
          this.event.message,
          candidate.overload.parameters,
          candidate.stream,
        ),
      );
      nextCandidates.push(candidate);
    } catch (e) {
      if (!(e instanceof ChatCommandError)) throw e;

      candidateErrors.set(candidate, {
        paramIdx: Object.values(candidate.overload.parameters).indexOf(param),
        error: e,
      });
    }
  }

  private handleNoMatch(
    command: Command,
    candidateErrors: Map<OverloadSelectionCandidate, { paramIdx: number; error: ChatCommandError }>,
  ): never {
    const { prefix } = this.commandManager;

    const errorMessages = [...candidateErrors].flatMap(([, { error }]) => {
      return [
        // s.gray(`${prefix}${candidate.overload.getSignature()}`),
        error instanceof TokenParseError ? Style.white(error.errorLocationString) : error.name,
        `  - ${Style.italic(error.message)}`,
      ].filter((v) => v !== undefined);
    });

    throw new ParseError(
      [
        "Oops! The command failed with the following errors:",
        ...errorMessages,
        "",
        `Type ${Style.white(`${prefix}help ${command.name}`)} for help with this command!`,
      ].join("\n"),
    );
  }
}

class OverloadSelectionCandidate {
  stream: TokenSubstream;
  overload: Overload;
  remainingParameters: Parameter[];
  argumentTokens: Record<string, Token<unknown>>;

  constructor(overload: Overload, stream: TokenSubstream) {
    this.stream = stream;
    this.overload = overload;
    this.remainingParameters = Object.values(overload.parameters);
    this.argumentTokens = {};
  }

  createChild(overload: Overload): OverloadSelectionCandidate {
    const child = new OverloadSelectionCandidate(overload, this.stream.clone());
    child.argumentTokens = { ...this.argumentTokens };
    return child;
  }

  toResult(): OverloadSelectionResult {
    return {
      overload: this.overload,
      argumentTokens: this.argumentTokens,
    };
  }
}

export interface ProcessCandidateContext {
  readonly candidate: OverloadSelectionCandidate;
  readonly nextCandidates: OverloadSelectionCandidate[];
  readonly candidateErrors: Map<OverloadSelectionCandidate, { paramIdx: number; error: ChatCommandError }>;
}

export interface OverloadSelectionResult {
  overload: Overload;
  argumentTokens: Record<string, Token<unknown>>;
}
