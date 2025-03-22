import type { InvocationCallback, Overload } from "~/commands";

import type { ParameterBuilder, ParametersFromBuilders } from "./parameter-types";
import { Builder } from "./builder";

/**
 * A builder for creating and configuring command overloads. \
 * Overloads define the different ways that a command can be triggered based on parameter types.
 *
 * Overloads **should not** be created this way. Instead use `overload()` or `command().createOverload()`.
 *
 * @template T
 *    The overload definition being built.
 */
export class OverloadBuilder<T extends Overload = Overload> extends Builder<T> {
  /**
   * Defines what this overload should do once it has been triggered.
   *
   * @example
   * overload({ amount: number() }).onExecute((ctx, { amount }) => {
   *   ctx.player.setDynamicProperty("money", amount);
   * });
   *
   * @param execute
   *    The function that will be called when this overload matches.
   * @returns
   *    The overload builder instance.
   */
  onExecute(execute: InvocationCallback<T>) {
    this.state.execute = execute;
    return this;
  }

  /**
   * Sets a description for the overload.
   * This description is typically displayed in help menus.
   *
   * @example
   * command("give money")
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
}

export type OverloadBuilderFromParameterBuilders<
  ParamBuilders extends Record<string, ParameterBuilder> = Record<string, ParameterBuilder>,
> = OverloadBuilder<Overload<ParametersFromBuilders<ParamBuilders>>>;
