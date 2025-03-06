import type { Invocation, Overload } from "~/commands";
import type { Arguments, Parameter } from "~/parameters";

import { Builder } from "./builder";

export class OverloadBuilder<T extends Record<string, Parameter> = Record<string, Parameter>> extends Builder<
  Overload<any> // Overload<T> fucks everything for god knows why
> {
  execute(execute: ((ctx: Invocation<T>, args: Arguments<T>) => void) | undefined): this {
    return this.__set({ execute } as Partial<Overload<T>>);
  }

  description(description: string) {
    return this.__set({ description });
  }
}
