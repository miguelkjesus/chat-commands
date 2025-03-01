import type { Invocation, Overload, OverloadParameters } from "~/commands";

import { Builder } from "./builder";

export class OverloadBuilder<T extends Overload = Overload> extends Builder<T> {
  execute(execute: ((ctx: Invocation<OverloadParameters<Overload>>) => void) | undefined): this {
    return this.__set({ execute } as Partial<T>);
  }
}
