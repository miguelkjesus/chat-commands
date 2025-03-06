import { Resolvable, resolve } from "~/utils/resolvers";
import { OverloadBuilder, ParameterBuilder } from "~/builders";
import { Overload } from "~/commands";

import { params, ParameterTypes } from "./parameter-types";

type ToParameters<T> = { [K in keyof T]: T[K] extends ParameterBuilder<infer T> ? T : never };

export function overload(): OverloadBuilder<{}>;
export function overload<TParamBuilders extends Record<string, ParameterBuilder>>(
  parameters: Resolvable<(t: ParameterTypes) => TParamBuilders>,
): OverloadBuilder<ToParameters<TParamBuilders>>;
export function overload<TParamBuilders extends Record<string, ParameterBuilder>>(
  parameters?: Resolvable<(t: ParameterTypes) => TParamBuilders>,
): OverloadBuilder<ToParameters<TParamBuilders>> {
  const paramBuilders = resolve(parameters, [params]);

  // Build the params, and assign the id to the key in the record
  const builtParams = {} as any;
  for (const [id, builder] of Object.entries(paramBuilders ?? {})) {
    const state = (builder as ParameterBuilder).__state;

    state.id = id;
    if (state.name === undefined) state.name = id;

    (builtParams as {})[id] = builder.__state;
  }

  return new OverloadBuilder(new Overload(builtParams, []));
}
