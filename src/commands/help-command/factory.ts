import { darkGray, darkRed, gold, gray, minecoin, red } from "@mhesus/mcbe-colors";

import { command } from "~/api/command";
import { integer, string } from "~/api/parameter-types";

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
// TODO add header
// TODO add footer

export function makeHelpCommand(options?: HelpCommandOptions) {
  removeHelpCommandIfExists();

  const c = { ...defaultColors, ...options?.colors };
  const aliases = options?.aliases ?? ["commands", "?"];
  const description = options?.description ?? "Get help on different commands";

  const help = command("help", ...aliases).setDescription(description);

  help
    .createOverload({ page: integer().setMin(1).setOptional() })
    .setDescription("View a list of commands")
    .onExecuteReadOnly((ctx, { page = 1 }) => {
      const pageSize = 10;
      const maxPages = Math.floor(ctx.manager.commands.size / pageSize + 0.5);
      page = Math.max(1, Math.min(page, maxPages));

      const pageStart = pageSize * (page - 1);
      const pageEnd = pageStart + pageSize;

      const commandMessages = ctx.manager.commands
        .values()
        .sort((a, b) => a.name.localeCompare(b.name))
        .flatMap((cmd) =>
          [
            c.highlight(ctx.manager.prefix + cmd.name),
            cmd.aliases.length > 0 ? c.dim(`(${cmd.aliases.join(", ")})`) : undefined,
            cmd.description,
          ]
            .filter((v) => v !== undefined)
            .join(" "),
        )
        .slice(pageStart, pageEnd);

      const banner = `${"-".repeat(10)}[${c.highlight(ctx.manager.prefix + "help")} ${`page ${page}/${maxPages}`}]${"-".repeat(10)}`;

      ctx.player.sendMessage(
        [
          c.mute(banner),
          `Type ${c.highlight("!help")} ${c.mute("<command>")} to learn how to use a command!`,
          " ",
          ...commandMessages,
        ].join("\n"),
      );
    });

  help
    .createOverload({ commandName: string("command") })
    .setDescription("Get help on a specific command")
    .onExecuteReadOnly((ctx, { commandName }) => {
      if (!ctx.manager.commands.usableBy(ctx.player).aliases().includes(commandName)) {
        throw ctx.error("Unknown command.");
      }

      const command = ctx.manager.commands.get(commandName)!;
      const banner = `${"-".repeat(10)}[${c.highlight(`${ctx.manager.prefix}help ${c.mute(command.name)}`)}]${"-".repeat(10)}`;

      const signatures = command
        .getAllOverloads()
        .filter((overload) => overload.hasExecuteCallback)
        .map((overload) =>
          [
            `${c.highlight(ctx.manager.prefix + command.name)}`,
            ...Object.values(overload.parameters).map((param) => c.mute(param.getSignature())),
            overload.description,
          ]
            .filter((v) => v)
            .join(" "),
        );

      ctx.player.sendMessage(
        [
          banner,
          c.mute("Aliases: ") +
            [command.name, ...command.aliases].map((s) => c.highlight(ctx.manager.prefix + s)).join(c.mute(", ")),
          command.description,
          " ",
          ...signatures,
        ]
          .filter((v) => v)
          .join("\n"),
      );
    });
}
