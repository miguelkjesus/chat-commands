import { Resolvable, resolve } from "~/utils/resolvers";
import { Overload } from "~/commands";
import { OverloadBuilder, ParameterBuilder, ParametersFromBuilders } from "~/builders";

import { params, ParameterTypes } from "./parameter-types";
import { LiteralParameter } from "~/parameters";

export function overload(): OverloadBuilder<{}>;
export function overload<ParamBuilders extends Record<string, ParameterBuilder>>(
  parameters: Resolvable<(t: ParameterTypes) => ParamBuilders>,
): OverloadBuilder<ParametersFromBuilders<ParamBuilders>>;
export function overload<ParamBuilders extends Record<string, ParameterBuilder>>(
  parameters?: Resolvable<(t: ParameterTypes) => ParamBuilders>,
): OverloadBuilder<ParametersFromBuilders<ParamBuilders>> {
  const paramBuilders = resolve(parameters, [params]);

  // Build the params, and assign the id to the key in the record
  const builtParams = {} as any;
  for (const [id, builder] of Object.entries(paramBuilders ?? {})) {
    const state = (builder as ParameterBuilder).state;

    state.id = id;

    if (state instanceof LiteralParameter && state.choices.length === 0) {
      state.choices = [id];
    } else if (state.name === undefined) {
      state.name = id;
    }

    (builtParams as {})[id] = builder.state;
  }

  return new OverloadBuilder(new Overload(builtParams, []));
}
