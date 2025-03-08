import type { Invocation, Overload } from "~/commands";
import type { Arguments, Parameter } from "~/parameters";

import { Builder } from "./builder";

export class OverloadBuilder<T extends Record<string, Parameter> = Record<string, Parameter>> extends Builder<
  Overload<any> // Overload<T> fucks everything for god knows why
> {
  execute(execute: ((ctx: Invocation<T>, args: Arguments<T>) => void) | undefined) {
    this.state.execute = execute;
    return this;
  }

  description(description: string) {
    this.state.description = description;
    return this;
  }
}
