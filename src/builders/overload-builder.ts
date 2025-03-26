import { resolve, type Resolvable } from "~/utils/resolvers";
import { Parameters } from "~/api";
import { Overload, OverloadParameters } from "~/commands";
import { LiteralParameter } from "~/parameters";

import type { ParameterBuilder, ParametersFrom } from "./parameter-types";
import { Builder } from "./builder";

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
    parameters: ParamBuilders extends Record<any, never> ? never : Resolvable<(params: Parameters) => ParamBuilders>,
  ): ChildOverloadBuilder<State, ParamBuilders> {
    // TODO refactor how builders work such that either
    //  - they are constructed and readonly
    //  - keep them dynamic like now but without the typing (kinda shit)

    const builtParams = {};
    for (const [id, { state }] of Object.entries(resolve(parameters, [Parameters]))) {
      state.id = id;

      if (state instanceof LiteralParameter && state.choices.length === 0) {
        state.choices = [id];
      } else if (state.name === undefined) {
        state.name = id;
      }

      builtParams[id] = state;
    }

    const builder = new OverloadBuilder(new Overload({ ...this.state.parameters, ...builtParams }, []));
    (this.state.overloads as any).push(builder.state);
    return builder as ChildOverloadBuilder<State, ParamBuilders>;
  }

  /**
   * Defines what this overload should do once it has been triggered.
   *
   * @example
   * giveMoney
   *   .createOverload({ amount: number().gte(0) })
   *   .onExecute((ctx, { amount }) => {
   *     ctx.player.setDynamicProperty("money", amount);
   *   });
   *
   * @param execute
   *    The function that will be called when this overload matches.
   * @returns
   *    The overload builder instance.
   */
  onExecute(execute: State["execute"]) {
    this.state.execute = execute;
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
  canPlayerUse(callback: State["canPlayerUse"]) {
    this.state.canPlayerUse = callback;
    return this;
  }
}

/**
 * Evaluates the type of a child overload when created from a parent.
 */
export type ChildOverloadBuilder<
  Parent extends Overload,
  ParamBuilders extends Record<string, ParameterBuilder> = Record<string, ParameterBuilder>,
> = OverloadBuilder<Overload<OverloadParameters<Parent> & ParametersFrom<ParamBuilders>>>;
