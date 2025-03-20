import { type Resolvable, resolve } from "~/utils/resolvers";
import {
  type OverloadBuilderFromParameterBuilders,
  type ParameterBuilder,
  type ParametersFromBuilders,
  OverloadBuilder,
} from "~/builders";
import { LiteralParameter } from "~/parameters";
import { Overload } from "~/commands";

import { type ParameterTypes, params } from "./parameters-object";

/**
 * Creates a new overload with the specified parameter types. \
 * Overloads define the different ways that a command can be triggered based on parameter types.
 *
 * @example
 * command("teleport", "tp")
 *   .setOverloads(
 *     overload({
 *       victims: entity(),
 *       location: vector3(),
 *     })
 *   );
 *
 * @param parameters
 *    An object defining the parameter that this overload expects. \
 *    Each key represents a parameter name, and the value defines its type.
 * @returns
 *    A builder instance for configuring the overload.
 */
export function overload<ParamBuilders extends Record<string, ParameterBuilder>>(
  parameters?: Resolvable<(t: ParameterTypes) => ParamBuilders>,
): OverloadBuilderFromParameterBuilders<ParamBuilders> {
  const paramBuilders = resolve(parameters, [params]);

  // Build the params, and assign the id to the key in the record
  const builtParams = {};
  for (const [id, { state }] of Object.entries(paramBuilders ?? {})) {
    state.id = id;

    if (state instanceof LiteralParameter && state.choices.length === 0) {
      state.choices = [id];
    } else if (state.name === undefined) {
      state.name = id;
    }

    builtParams[id] = state;
  }

  return new OverloadBuilder(new Overload(builtParams as ParametersFromBuilders<ParamBuilders>, []));
}
