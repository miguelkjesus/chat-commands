import { Style } from "@mhesus/mcbe-colors";

export interface HelpCommandOptions {
  colors?: Partial<HelpCommandColorScheme>;
  description?: string;
  aliases?: string[];
}

// TODO redo color scheme. this is kinda shit. add more flexibility somehow

export interface HelpCommandColorScheme {
  mute: Style;
  dim: Style;

  highlight: Style;
  dimHighlight: Style;

  error: Style;
  dimError: Style;
}
