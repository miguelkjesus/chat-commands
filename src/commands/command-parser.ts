import type { ChatSendBeforeEvent, Player } from "@minecraft/server";
import { Style as s } from "@mhesus/mcbe-colors";

import { ParameterParseTokenContext, type Parameter } from "~/parameters";
import { parsers, TokenStream } from "~/tokens";
import { ChatCommandError, ParseError } from "~/errors";

import type { CommandManager } from "./command-manager";
import type { ExecuteCallback, Overload } from "./overload";
import { Command } from "./command";
import { Invocation } from "./invocation";

// FIXME errors kinda work, but some weird nuances. Fix this later

export class CommandParser {
  private manager: CommandManager;

  constructor(manager: CommandManager) {
    this.manager = manager;
  }

  getExecuteParameters(event: ChatSendBeforeEvent): Parameters<ExecuteCallback<Overload>> | undefined {
    if (!this.isCommandMessage(event.message)) return;

    const stream = this.createTokenStream(event.message);
    const command = this.getInvokedCommand(stream, event.sender);
    const { overload, args } = this.getInvokedOverload(command, stream, event);

    return [new Invocation(this.manager, event.sender, event.message, overload, command), args];
  }

  private isCommandMessage(message: string) {
    return message.startsWith(this.manager.prefix);
  }

  private createTokenStream(message: string) {
    return new TokenStream(message.slice(this.manager.prefix.length));
  }

  private getInvokedCommand(stream: TokenStream, player: Player): Command {
    const { commands, prefix } = this.manager;

    const usableAliases = commands.usableBy(player).aliases();
    const alias = stream.pop(parsers.literal(usableAliases));
    const command = commands.get(alias);

    if (command === undefined) {
      const bestMatch = stream.pop(parsers.fuzzy(usableAliases));
      const suggestion = bestMatch ? ` Did you mean ${s.white(prefix + bestMatch)}?` : "";
      throw new ParseError(`Unknown command.${suggestion}\nType ${s.white(prefix + "help")} for a list of commands!`);
    }

    return command;
  }

  private getInvokedOverload(
    command: Command,
    stream: TokenStream,
    event: ChatSendBeforeEvent,
  ): OverloadSelectionResult {
    let currentCandidates = [new OverloadSelectionCandidate(command, stream)];
    let candidateErrors = new Map<OverloadSelectionCandidate, { paramIdx: number; error: ChatCommandError }>();

    while (currentCandidates.length > 0) {
      if (candidateErrors.size > 0) {
        // Filter out errors from candidates that have already failed
        candidateErrors = new Map([...candidateErrors].filter(([candidate]) => currentCandidates.includes(candidate)));
      }

      const nextCandidates: OverloadSelectionCandidate[] = [];

      for (const candidate of currentCandidates) {
        const result = this.processCandidate({ candidate, event, nextCandidates, candidateErrors });
        if (result) return result; // Found a successful match
      }

      currentCandidates = nextCandidates;
    }

    // No successful match found, throw a combined error
    this.handleNoMatch(command, candidateErrors);
  }

  private processCandidate(ctx: ProcessCandidateContext): OverloadSelectionResult | undefined {
    let { candidate, nextCandidates, candidateErrors } = ctx;

    const param = candidate.remainingParameters.pop();
    const overloads = candidate.overload.overloads;

    if (param) {
      this.parseParameter(ctx, param);
      return;
    }

    if (!candidate.stream.isEmpty() && !overloads.length) {
      candidateErrors.set(candidate, {
        paramIdx: Object.values(candidate.overload.parameters).length - 1,
        error: new ParseError("Too many parameters!"),
      });
      return;
    }

    if (candidate.overload.executeCallback) {
      return candidate.toResult();
    }

    nextCandidates.push(...overloads.map((overload) => candidate.createChild(overload)));
  }

  private parseParameter(
    { candidate, event, nextCandidates, candidateErrors }: ProcessCandidateContext,
    param: Parameter,
  ) {
    try {
      candidate.args[param.id!] = param.parse(
        new ParameterParseTokenContext(event.sender, event.message, candidate.overload.parameters, candidate.stream),
      );
      nextCandidates.push(candidate);
    } catch (err) {
      if (!(err instanceof ChatCommandError)) throw err;
      candidateErrors.set(candidate, {
        paramIdx: Object.values(candidate.overload.parameters).indexOf(param),
        error: err,
      });
    }
  }

  private handleNoMatch(
    command: Command,
    candidateErrors: Map<OverloadSelectionCandidate, { paramIdx: number; error: ChatCommandError }>,
  ): never {
    const { prefix } = this.manager;

    const errorMessages = [...candidateErrors].flatMap(([candidate, { paramIdx, error }]) => {
      let signaturePrefix = s.gray(`${prefix}${getOverloadSignatureSlice(candidate.overload, [0, paramIdx - 1])}`);
      let erroneousParamSignature = s.gray(Object.values(candidate.overload.parameters)[paramIdx].getSignature());

      return [
        `${signaturePrefix} ${s.red.bold(">>")} ${erroneousParamSignature} ${s.red.bold("<<")}`,
        `  - ${s.italic(error.message)}`,
      ];
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

export interface ProcessCandidateContext {
  readonly candidate: OverloadSelectionCandidate;
  readonly event: ChatSendBeforeEvent;
  readonly nextCandidates: OverloadSelectionCandidate[];
  readonly candidateErrors: Map<OverloadSelectionCandidate, { paramIdx: number; error: ChatCommandError }>;
}

export interface OverloadSelectionResult {
  overload: Overload;
  args: Record<string, unknown>;
}
