import type { Resolvable } from "~/utils/resolvers";
import { type ParameterTypes, overload } from "~/api";
import { type Command, Overload } from "~/commands";

import { Builder } from "./builder";
import { OverloadBuilder, OverloadBuilderFromParameterBuilders } from "./overload-builder";
import { ParameterBuilder } from "./parameter-types";

/**
 * A builder for configuring commands.
 *
 * @template Overloads
 *    The overload definitions for the command.
 */
export class CommandBuilder<Overloads extends readonly Overload[] = readonly Overload[]> extends Builder<
  Command<Overloads>
> {
  /**
   * Sets aliases for the command, allowing it to be invoked using alternative names.
   *
   * @example
   * command("teleport")
   *   .setAliases("tp", "warp", "goto");
   *
   * // This is equivalent
   * command("teleport", "tp", "warp", "goto")
   *
   * @param aliases
   *    Alternative names for the command.
   * @returns
   *    The command builder instance.
   */
  setAliases(...aliases: string[]) {
    this.state.aliases = aliases;
    return this;
  }

  /**
   * Sets the description for the command.
   * This description is typically shown in help menus.
   *
   * @example
   * command("teleport")
   *   .setDescription("Teleport entities to a specified location or to another entity.");
   *
   * @param description
   *    A brief explanation of what the command does.
   * @returns
   *    The command builder instance.
   */
  setDescription(description: string) {
    this.state.description = description;
    return this;
  }

  /**
   * Defines the overloads (parameter patterns) that the command can accept.
   *
   * @example
   * command("teleport").setOverloads(
   *   overload({ target: entity(), location: vector3() }),
   *   overload({ location: vector3() })
   * );
   *
   * @param overloads
   *    The overloads that the command can accept.
   * @returns
   *    The updated command builder instance.
   */
  setOverloads<T extends readonly OverloadBuilder<Overload<any, any>>[]>(...overloads: T) {
    this.state.overloads = overloads.map((builder) => builder.state as OverloadsFromBuilders<T>[number]) as any;
    return this as any as CommandBuilder<OverloadsFromBuilders<T>>;
  }

  /**
   * Creates and adds a new overload for the command using the specified parameters.
   *
   * @example
   * command("smite").createOverload({ victim: entity() });
   *
   * @param parameters
   *    A function that defines the parameters for the overload.
   * @returns
   *    A builder for further configuring the overload.
   */
  createOverload<ParamBuilders extends Record<string, ParameterBuilder>>(
    parameters?: Resolvable<(t: ParameterTypes) => ParamBuilders>,
  ): OverloadBuilderFromParameterBuilders<ParamBuilders> {
    // TODO refactor how builders work such that either
    //  - they are constructed and readonly
    //  - keep them dynamic like now but without the typing (kinda shit)
    const builder = overload(parameters as any);
    this.state.overloads = [...this.state.overloads, builder.state] as any;
    return builder;
  }

  /**
   * Registers a callback function to be executed after the command runs.
   *
   * **Warning:** If you use `system.run()`, or any other method to asynchronously delay code within the command, this callback may be invoked before the command ends!
   *
   * @example
   * command("ban").afterExecute((ctx) => {
   *   console.log(`${ctx.player.name} executed the ban command.`);
   * });
   *
   * @param callback
   *    A function to be executed after the command is processed.
   * @returns
   *    The command builder instance.
   */
  afterExecute(callback: Command<Overloads>["afterExecute"]) {
    this.state.afterExecute = callback;
    return this;
  }

  /**
   * Registers a callback function to be executed before the command runs.
   *
   * @example
   * command("kick").beforeExecute((ctx) => {
   *   if (!ctx.player.isOp()) {
   *     throw ctx.error("You lack the permissions to use this command.");
   *   }
   * });
   *
   * @param callback
   *    A function to be executed before the command is processed.
   * @returns
   *    The command builder instance.
   */
  beforeExecute(callback: Command<Overloads>["beforeExecute"]) {
    this.state.beforeExecute = callback;
    return this;
  }
}

export type OverloadsFromBuilders<T> = {
  [K in keyof T]: T[K] extends OverloadBuilder<infer U> ? U : never;
};
