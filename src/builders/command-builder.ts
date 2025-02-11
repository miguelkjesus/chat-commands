import { Command } from "~/commands";
import { Builder } from "./builder";

export class CommandBuilder extends Builder<Command> {
  description(description: Command["description"]) {
    return this.$set({ description });
  }

  execute(execute: Command["execute"]) {
    return this.$set({ execute });
  }
}
