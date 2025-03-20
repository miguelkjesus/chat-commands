import {
  type HelpCommandColors,
  type HelpCommandOptions,
  makeHelpCommand,
  removeHelpCommandIfExists,
} from "~/commands";

import { Builder } from "./builder";

export class HelpCommandBuilder extends Builder<HelpCommandOptions> {
  setColors(colors: Partial<HelpCommandColors>) {
    this.state.colors = colors;
    makeHelpCommand(this.state);
    return this;
  }

  setDescription(description: string) {
    this.state.description = description;
    makeHelpCommand(this.state);
    return this;
  }

  setAliases(aliases: string[]) {
    this.state.aliases = aliases;
    makeHelpCommand(this.state);
    return this;
  }

  remove() {
    removeHelpCommandIfExists();
  }
}
