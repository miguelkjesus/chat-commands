import { system, type Player } from "@minecraft/server";

import type { Arguments, Parameter } from "~/parameters";

import type { Invocation } from "./invocation";
import { Command } from "./command";
import { CooldownManager } from "./cooldown-manager";
import { Style } from "@mhesus/mcbe-colors";
import { ChatCommandError } from "~/errors";

export class Overload<Params extends Record<string, Parameter> = Record<string, Parameter>> {
  readonly parameters: Params;
  readonly parent?: Overload;
  overloads: Overload[] = [];
  description?: string;

  canPlayerUseCallback?: (player: Player) => boolean;
  onExecuteReadOnlyCallback?: ExecuteCallback<this>;
  onExecuteCallback?: ExecuteCallback<this>;

  private ownCooldownManager?: CooldownManager;

  constructor(parameters: Params, parent?: Overload) {
    this.parameters = parameters;
    this.parent = parent;
  }

  get hasExecuteCallback() {
    return this.onExecuteReadOnlyCallback !== undefined || this.onExecuteCallback !== undefined;
  }

  get command(): Command | undefined {
    if (this.parent === undefined) {
      if (this instanceof Command) return this;
      return undefined;
    }

    return this.parent.command;
  }

  get cooldownManager(): CooldownManager | undefined {
    if (this.ownCooldownManager) return this.ownCooldownManager;
    if (this.parent) return this.parent.cooldownManager;
  }

  set cooldownManager(cooldownManager: CooldownManager) {
    this.ownCooldownManager = cooldownManager;
  }

  execute(...params: Parameters<ExecuteCallback<this>>) {
    const ctx = params[0];
    const cooldown = Math.ceil((this.cooldownManager?.getRemainingTicks(ctx.player.id) ?? 0) / 20);

    if (cooldown > 0) {
      ctx.player.sendMessage(
        Style.red(`You must wait ${cooldown} second${cooldown == 1 ? "" : "s"} before using this command again.`),
      );
      return;
    }

    try {
      this.onExecuteReadOnlyCallback?.(...params);
    } catch (e) {
      this.handleChatCommandError(e, ctx.player);
    }

    system.run(() => {
      try {
        this.onExecuteCallback?.(...params);
      } catch (e) {
        this.handleChatCommandError(e, ctx.player);
      }
    });

    this.cooldownManager?.trigger(ctx.player.id);
  }

  private handleChatCommandError(error: Error, player: Player) {
    if (!(error instanceof ChatCommandError)) throw error;
    player.sendMessage(Style.red(error.message));
  }

  canPlayerUse(player: Player) {
    return this.canPlayerUseCallback?.(player) ?? true;
  }

  getSignature(): string {
    return [this.command?.name, ...Object.values(this.parameters).map((param) => param.getSignature())]
      .filter((v) => v !== undefined)
      .join(" ");
  }

  getAllOverloads(): Overload[] {
    return [...this.overloads, ...this.overloads.flatMap((overload) => overload.getAllOverloads())];
  }
}

// I would just infer Params, but TS throws a hissy fit with inferring the parameters of commands if you do lol.
export type OverloadParameters<T extends Overload> = T["parameters"];

export type OverloadArguments<T extends Overload> = Arguments<OverloadParameters<T>>;

export type ExecuteCallback<T extends Overload> = (
  ctx: Invocation<T>,
  args: OverloadArguments<T>,
) => void | Promise<void>;
