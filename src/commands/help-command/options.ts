import { Style } from "@mhesus/mcbe-colors";

export interface HelpCommandOptions {
  colors?: Partial<HelpCommandColors>;
  description?: string;
  aliases?: string[];
}

export interface HelpCommandColors {
  mute: Style;
  dim: Style;

  highlight: Style;
  dimHighlight: Style;

  error: Style;
  dimError: Style;
}
