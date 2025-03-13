import { type Resolvable, resolve } from "~/utils/resolvers";
import { OverloadBuilder, ParameterBuilder, ParametersFromBuilders } from "~/builders";
import { LiteralParameter } from "~/parameters";
import { Overload } from "~/commands";

import { type ParameterTypes, params } from "./parameters-object";

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
  for (const [id, { state }] of Object.entries(paramBuilders ?? {})) {
    state.id = id;

    if (state instanceof LiteralParameter && state.choices.length === 0) {
      state.choices = [id];
    } else if (state.name === undefined) {
      state.name = id;
    }

    (builtParams as {})[id as string] = state;
  }

  return new OverloadBuilder(new Overload(builtParams, []));
}
