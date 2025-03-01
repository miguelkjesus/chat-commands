import { resolve } from "~/utils/resolvers";
import { OverloadBuilder, ParameterBuilder } from "~/builders";
import { Overload } from "~/commands";
import { Parameter } from "~/parameters";

import * as parameterTypes from "./parameters";

export function overload<const TParams extends Record<string, Parameter>>(parameters: {
  [K in keyof TParams]: ParameterBuilder<TParams[K]>;
}) {
  const paramBuilders = resolve(parameters, [parameterTypes]);

  // Build the params, and assign the id to the key in the record
  const builtParams = {} as TParams;
  for (const [id, builder] of Object.entries(paramBuilders)) {
    const state = (builder as ParameterBuilder).__state;

    state.id = id;
    if (state.name === undefined) state.name = id;

    (builtParams as {})[id] = builder.__state;
  }

  return new OverloadBuilder(new Overload(builtParams));
}
