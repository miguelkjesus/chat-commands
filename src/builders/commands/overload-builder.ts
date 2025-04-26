import { CooldownManager, Overload, type OverloadParameters } from "~/commands";
import { getValue, type CallbackOrValue } from "~/utils/callback-or-value";
import type { Simplify } from "~/utils/types";

import { Player } from "@minecraft/server";
import { Builder } from "../builder";
import type { ParameterBuilder, ParametersFrom } from "../parameter-types";

/**
 * A builder for creating and configuring command overloads. \
 * Overloads define the different ways that a command can be triggered based on parameter types.
 *
 * Overloads **should not** be created this way. Instead use `overload()` or `command().createOverload()`.
 *
 * @template State
 *    The overload definition being built.
 */
export class OverloadBuilder<State extends Overload> extends Builder<State> {
  /**
   * Sets a description for the overload.
   * This description is typically displayed in help menus.
   *
   * @example
   * giveMoney
   *   .createOverload({ amount: number() })
   *   .setDescription("Give yourself money.");
   *
   * @param description
   *    A brief explanation of what this overload does.
   * @returns
   *    The overload builder instance.
   */
  setDescription(description: string) {
    this.state.description = description;
    return this;
  }

  /**
   * Creates and adds a new overload for the command using the specified parameters.
   *
   * @example
   * smite.createOverload({ victim: entity() });
   *
   * @param parameters
   *    A function that defines the parameters for the overload.
   * @returns
   *    A builder for further configuring the overload.
   */
  createOverload<ParamBuilders extends Record<string, ParameterBuilder>>(
    parameters: ParamBuilders extends Record<any, never> ? never : CallbackOrValue<ParamBuilders, [player: Player]>,
  ): OverloadBuilderFromParent<State, ParamBuilders> {
    const resolved = (...args) =>
      Object.fromEntries(Object.entries(getValue(parameters, args)).map(([k, v]) => [k, v.state]));

    const builder = new OverloadBuilder(
      new Overload((...args) => ({ ...this.state.getParameters(...args), ...getValue(resolved, args) }), this.state),
    );
    this.state.overloads.push(builder.state);
    return builder as OverloadBuilderFromParent<State, ParamBuilders>;
  }

  /**
   * Defines what actions this overload should perform, when it is executed. \
   * Mind that all code in here will be executed in read-only mode. Either use `onExecute` or `system.run` to escape read-only mode.
   *
   * @example
   * giveMoney
   *   .createOverload({ amount: number().gte(0) })
   *   .onExecute((ctx, { amount }) => {
   *     ctx.player.setDynamicProperty("money", amount);
   *   });
   *
   * @param execute
   *    The function that will be called when this overload is invoked.
   * @returns
   *    The overload builder instance.
   */
  onExecuteReadOnly(execute: State["onExecuteReadOnlyCallback"]) {
    this.state.onExecuteReadOnlyCallback = execute;
    return this;
  }

  /**
   * Defines what actions this overload should perform, when it is executed.
   *
   * @example
   * smite
   *   .createOverload({ victims: entities() })
   *   .executeOnNextTick((ctx, { victims }) => {
   *     for (const victim of victims) {
   *       victim.dimension.spawnEntity("lightning_bolt", victim.location);
   *     }
   *   });
   *
   * @param execute
   *    The function that will be called when this overload is invoked.
   * @returns
   *    The overload builder instance.
   */
  onExecute(execute: State["onExecuteCallback"]) {
    this.state.onExecuteCallback = execute;
    return this;
  }

  /**
   * Sets a callback function that determines whether a player can use this overload. \
   * This function is called to check if the command should be available to the player.
   *
   * @example
   * banPlayer
   *   .createOverload({ target: player() })
   *   .canPlayerUse((ctx) => ctx.player.hasPermission("ban"))
   *   .onExecute((ctx, { target }) => {
   *     target.ban();
   *   });
   *
   * @param callback
   *    A function that takes the command context and returns a boolean indicating whether the player can use the overload.
   * @returns
   *    The overload builder instance.
   */
  canPlayerUse(callback: State["canPlayerUseCallback"]) {
    this.state.canPlayerUseCallback = callback;
    return this;
  }

  /**
   * Sets a cooldown for an overload.
   *
   * @example
   * home
   *  .createOverload({ location: string() })
   *  .setCooldownTicks(5 * 20); // 5 * 20 ticks = 5 seconds
   *
   * @param cooldownTicks
   *    The cooldown for the command in ticks.
   * @returns
   *    The command builder instance.
   */
  setCooldownTicks(cooldownTicks: number) {
    if (!this.state.cooldownManager) {
      this.state.cooldownManager = new CooldownManager(cooldownTicks);
    } else {
      this.state.cooldownManager.cooldownTicks = cooldownTicks;
    }

    return this;
  }
}

/**
 * Evaluates the type of a child overload when created from a parent.
 */
export type OverloadBuilderFromParent<
  Parent extends Overload,
  ParamBuilders extends Record<string, ParameterBuilder> = Record<string, ParameterBuilder>,
> = OverloadBuilder<Overload<Simplify<OverloadParameters<Parent> & ParametersFrom<ParamBuilders>>>>;
