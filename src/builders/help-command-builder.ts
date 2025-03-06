import { type HelpCommandColors, type HelpCommandOptions, makeHelpCommand, removeHelpCommand } from "~/commands";

import { Builder, StateOf } from "./builder";

export class HelpCommandBuilder extends Builder<HelpCommandOptions> {
  protected __set(object: HelpCommandOptions): this;
  protected __set<Next extends Builder>(object: Partial<StateOf<Next>>): Next;
  protected __set<Next extends Builder = this>(object: any): Next {
    super.__set(object);
    makeHelpCommand(this.__state);
    return this as unknown as Next;
  }

  colors(colors: Partial<HelpCommandColors>) {
    return this.__set({ colors });
  }

  description(description: string) {
    return this.__set({ description });
  }

  aliases(aliases: string[]) {
    return this.__set({ aliases });
  }

  remove() {
    removeHelpCommand();
  }
}
