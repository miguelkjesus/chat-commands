import type { Invocation, InvocationCallback, Overload } from "~/commands";
import type { Arguments, Parameter } from "~/parameters";

import { Builder } from "./builder";
import { Simplify } from "~/utils/types";

export class OverloadBuilder<T extends Record<string, Parameter> = Record<string, Parameter>> extends Builder<
  Overload<any> // Overload<T> fucks everything for god knows why
> {
  execute(execute: InvocationCallback<T>) {
    this.state.execute = execute;
    return this;
  }

  description(description: string) {
    this.state.description = description;
    return this;
  }
}
