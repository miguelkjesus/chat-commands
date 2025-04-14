import type { ChatSendAfterEvent } from "@minecraft/server";
import { Style as s, Style } from "@mhesus/mcbe-colors";

import { Command, CommandManager, Invocation, Overload } from "~/commands";
import { Parameter, ParameterParseTokenContext } from "~/parameters";
import { ChatCommandError, ParseError, TokenParseError } from "~/errors";

import { Token, TokenParser } from "../token";
import type { TokenSubstream } from "../stream";

import { LiteralParser } from "./literal-parser";
import { FuzzyParser } from "./fuzzy-parser";
import debug from "~/utils/debug";

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
      const aliasToken = stream.pop(new LiteralParser(usableAliases));
      const command = commands.get(aliasToken.value)!;
      return aliasToken.map(() => command);
    } catch (e) {
      if (!(e instanceof ChatCommandError)) throw e;

      const bestMatchToken = stream.pop(new FuzzyParser(usableAliases));
      const suggestion = bestMatchToken.value ? ` Did you mean ${s.white(prefix + bestMatchToken.value)}?` : "";
      throw bestMatchToken.error(
        `Unknown command.${suggestion}\nType ${s.white(prefix + "help")} for a list of commands!`,
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

    if (candidate.overload.executeCallback) {
      return candidate.toResult();
    }

    nextCandidates.push(...overloads.map((overload) => candidate.createChild(overload)));
  }

  private parseParameter({ candidate, nextCandidates, candidateErrors }: ProcessCandidateContext, param: Parameter) {
    try {
      debug.log(
        Style.darkAqua(
          `======== ${getOverloadSignatureSlice(candidate.overload, [
            0,
            Object.values(candidate.overload.parameters).indexOf(param) - 1,
          ])} ${Style.aqua(param.getSignature())} =========`,
        ),
      );

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

    const errorMessages = [...candidateErrors].flatMap(([candidate, { paramIdx, error }]) => {
      return [
        // s.gray(`${prefix}${candidate.overload.getSignature()}`),
        error instanceof TokenParseError ? s.white(error.errorLocationString) : "TODO PARSE ERROR!",
        `  - ${s.italic(error.message)}`,
      ].filter((v) => v !== undefined);
    });

    throw new ParseError(
      [
        "Oops! The command couldn't be executed due to the following errors:",
        ...errorMessages,
        "",
        `Type ${s.white(`${prefix}help ${command.name}`)} for help with this command!`,
      ].join("\n"),
    );
  }
}

function getOverloadSignatureSlice(overload: Overload, [start, end]: [(number | null)?, (number | null)?]): string {
  start ??= 0;
  end ??= Object.values(overload.parameters).length - 1;

  return [
    overload.command?.name,
    ...Object.values(overload.parameters)
      .slice(start, end + 1)
      .map((param) => param.getSignature()),
  ]
    .filter((v) => v !== undefined)
    .join(" ");
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
