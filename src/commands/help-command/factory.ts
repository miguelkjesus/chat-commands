import { darkGray, darkRed, gold, gray, minecoin, red } from "@mhesus/mcbe-colors";

import { joinTruthy } from "~/utils/string";
import { command } from "~/api/command";
import { number, string } from "~/api/parameter-types";

import { manager } from "../command-manager";
import { HelpCommandOptions } from "./options";

const defaultColors = {
  mute: gray,
  dim: darkGray,

  highlight: minecoin,
  dimHighlight: gold,

  error: red,
  dimError: darkRed,
} as const;

export function removeHelpCommandIfExists() {
  const existing = manager.commands.get("help");
  if (existing) {
    manager.commands.delete(existing);
  }
}

// TODO add option to see parameter descriptions

export function makeHelpCommand(options?: HelpCommandOptions) {
  removeHelpCommandIfExists();

  const c = { ...defaultColors, ...options?.colors };
  const aliases = options?.aliases ?? ["commands", "?"];
  const description = options?.description ?? "Get help on different commands";

  const help = command("help", ...aliases).setDescription(description);

  help
    .createOverload({ page: number().gte(1).optional() })
    .setDescription("View a list of commands")
    .onExecute((ctx, { page }) => {
      const pageSize = 10;

      const commands = ctx.manager.commands
        .values()
        .sort((a, b) => a.name.localeCompare(b.name))
        .flatMap((cmd) =>
          joinTruthy(" ", [
            c.highlight(ctx.manager.prefix + cmd.name),
            cmd.aliases.length > 0 && c.dim(`(${cmd.aliases.join(", ")})`),
            cmd.description,
          ]),
        )
        .slice(pageSize * (page - 1), pageSize * page);

      const banner =
        "-".repeat(10) +
        `[${c.highlight(ctx.manager.prefix + "help")} ${`page ${page}/${(commands.length / pageSize + 0.5).toFixed()}`}]` +
        "-".repeat(10);

      ctx.player.sendMessage(
        joinTruthy("\n", [
          c.mute(banner),
          `Type ${c.highlight("!help")} ${c.mute("<command>")} to learn how to use a command!`,
          " ",
          ...commands,
        ]),
      );
    });

  help
    .createOverload({ commandName: string("command") })
    .setDescription("Get help on a specific command")
    .onExecute((ctx, { commandName }) => {
      const command = ctx.manager.commands.get(commandName);
      if (command === undefined) {
        ctx.player.sendMessage(c.error("Unknown command."));
        return;
      }

      const banner = `${"-".repeat(10)}[${c.highlight(`${ctx.manager.prefix}help ${c.mute(command.name)}`)}]${"-".repeat(10)}`;

      const signatures = command.overloads.map((overload) =>
        joinTruthy(" ", [
          `${c.highlight(ctx.manager.prefix + command.name)}`,
          ...[...Object.values(overload.parameters)].map((param) => c.mute(param.getSignature())),
          overload.description,
        ]),
      );

      ctx.player.sendMessage(
        joinTruthy("\n", [
          banner,
          [command.name, ...command.aliases].map((s) => c.highlight(ctx.manager.prefix + s)).join(c.mute(", ")),
          command.description,
          " ",
          ...signatures,
        ]),
      );
    });
}
