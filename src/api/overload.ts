import { Resolvable, resolve } from "~/utils/resolvers";
import { Overload } from "~/commands";
import { OverloadBuilder, ParameterBuilder, ParametersFromBuilders } from "~/builders";

import { params, ParameterTypes } from "./parameter-types";

export function overload(): OverloadBuilder<{}>;
export function overload<TParamBuilders extends Record<string, ParameterBuilder>>(
  parameters: Resolvable<(t: ParameterTypes) => TParamBuilders>,
): OverloadBuilder<ParametersFromBuilders<TParamBuilders>>;
export function overload<TParamBuilders extends Record<string, ParameterBuilder>>(
  parameters?: Resolvable<(t: ParameterTypes) => TParamBuilders>,
): OverloadBuilder<ParametersFromBuilders<TParamBuilders>> {
  const paramBuilders = resolve(parameters, [params]);

  // Build the params, and assign the id to the key in the record
  const builtParams = {} as any;
  for (const [id, builder] of Object.entries(paramBuilders ?? {})) {
    const state = (builder as ParameterBuilder).state;

    state.id = id;
    if (state.name === undefined) state.name = id;

    (builtParams as {})[id] = builder.state;
  }

  return new OverloadBuilder(new Overload(builtParams, []));
}
