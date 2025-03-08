import { type Command, Overload } from "~/commands";

import { Builder } from "./builder";
import { OverloadBuilder } from "./overload-builder";

export class CommandBuilder<Overloads extends readonly Overload[] = readonly Overload[]> extends Builder<
  Command<Overloads>
> {
  aliases(...aliases: string[]) {
    this.state.aliases = aliases;
    return this;
  }

  description(description: string) {
    this.state.description = description;
    return this;
  }

  // subcommands(subcommands_: Command[]) {
  //   for (const subcommand of subcommands_) {
  //     subcommand.parent = this.__state as Command;
  //   }

  //   this.__default({ subcommands: new CommandCollection() });
  //   return this.__mutate(({ subcommands }) => subcommands!.add(...subcommands_));
  // }

  overloads<T extends readonly OverloadBuilder[]>(...overloads: T) {
    this.state.overloads = overloads.map((builder) => builder.state as OverloadsFromBuilders<T>[number]) as any;
    return this as any as CommandBuilder<OverloadsFromBuilders<T>>;
  }

  afterExecute(callback: Command<Overloads>["afterExecute"]) {
    this.state.afterExecute = callback;
    return this;
  }

  beforeExecute(callback: Command<Overloads>["beforeExecute"]) {
    this.state.beforeExecute = callback;
    return this;
  }
}

export type OverloadsFromBuilders<T> = {
  [K in keyof T]: T[K] extends OverloadBuilder<infer U> ? Overload<U> : never;
};
