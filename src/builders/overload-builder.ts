import type { Invocation, Overload, OverloadParameters } from "~/commands";

import { Builder } from "./builder";

export class OverloadBuilder<T extends Overload = Overload> extends Builder<T> {
  execute(execute: ((ctx: Invocation<OverloadParameters<T>>) => void) | undefined): this {
    return this.__set({ execute } as Partial<T>);
  }
}
