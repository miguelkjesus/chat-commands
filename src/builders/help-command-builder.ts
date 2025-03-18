import {
  type HelpCommandColors,
  type HelpCommandOptions,
  makeHelpCommand,
  removeHelpCommandIfExists,
} from "~/commands";

import { Builder } from "./builder";

export class HelpCommandBuilder extends Builder<HelpCommandOptions> {
  colors(colors: Partial<HelpCommandColors>) {
    this.state.colors = colors;
    makeHelpCommand(this.state);
    return this;
  }

  description(description: string) {
    this.state.description = description;
    makeHelpCommand(this.state);
    return this;
  }

  aliases(aliases: string[]) {
    this.state.aliases = aliases;
    makeHelpCommand(this.state);
    return this;
  }

  remove() {
    removeHelpCommandIfExists();
  }
}
