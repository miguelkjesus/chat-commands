import { Player } from "@minecraft/server";
import { compute, Computed, GetterOrValue } from "./getters";

export interface Command {
  name?: string;
  description?: GetterOrValue<CommandInvocationCallback<string>>;
  execute?: CommandInvocationCallback;
}

export interface CommandInvocationContext {
  player: Player;
  message: string;
}

export type CommandInvocationCallback<Return = void> = (
  context: CommandInvocationContext
) => Return;

export type ComputedCommand = Computed<Command, "description">;

export function computeCommand(
  command: Command,
  context: CommandInvocationContext
): ComputedCommand {
  return compute(command, ["description"], context);
}
