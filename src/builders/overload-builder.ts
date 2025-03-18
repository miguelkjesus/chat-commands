import type { InvocationCallback, Overload } from "~/commands";

import type { ParameterBuilder, ParametersFromBuilders } from "./parameter-types";
import { Builder } from "./builder";

export class OverloadBuilder<T extends Overload = Overload> extends Builder<T> {
  execute(execute: InvocationCallback<T>) {
    this.state.execute = execute;
    return this;
  }

  description(description: string) {
    this.state.description = description;
    return this;
  }
}

export type OverloadBuilderFromParameterBuilders<
  ParamBuilders extends Record<string, ParameterBuilder> = Record<string, ParameterBuilder>,
> = OverloadBuilder<Overload<ParametersFromBuilders<ParamBuilders>>>;
