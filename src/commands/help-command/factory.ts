import { darkGray, darkRed, gold, gray, minecoin, red } from "@mhesus/mcbe-colors";

import { command } from "~/api/command";
import { manager } from "~/api/command-manager";
import { overload } from "~/api/overload";
import { t } from "~/api/parameter-types";

import { HelpCommandOptions } from "./options";

const defaultColors = {
  mute: gray,
  dim: darkGray,

  highlight: minecoin,
  dimHighlight: gold,

  error: red,
  dimError: darkRed,
} as const;

export function removeHelpCommand() {
  const existing = manager.commands.get("help");
  if (existing) {
    manager.commands.delete(existing);
  }
}

export function makeHelpCommand(options?: HelpCommandOptions) {
  removeHelpCommand();

  const c = { ...defaultColors, ...options?.colors };
  const aliases = options?.aliases ?? ["commands", "?"];
  const description = options?.description ?? "Get help on different commands";

  command("help", ...aliases)
    .description(description)
    .overloads(
      overload({ page: t.number().gte(1).default(1) })
        .description("View a list of commands")
        .execute((ctx, { page }) => {
          const pageSize = 10;

          const commands = ctx.manager.commands.values()
            .flatMap((cmd) =>
              [
                c.highlight(ctx.manager.prefix + cmd.name),
                cmd.aliases.length > 0 ? c.dim(`(${cmd.aliases.join(", ")})`) : undefined,
                cmd.description ? cmd.description : undefined,
              ]
                .filter((str) => str !== undefined)
                .join(" "),
            )
            .slice(pageSize * (page - 1), pageSize * page);

          const banner = `${"-".repeat(10)}[${c.highlight(ctx.manager.prefix + "help")} ${`page ${page}/${(
            commands.length / pageSize +
            0.5
          ).toFixed()}`}]${"-".repeat(10)}`;

          ctx.player.sendMessage(
            [
              c.mute(banner),
              `Type ${c.highlight("!help")} ${c.mute("<command>")} to learn how to use a command!`,
              "",
              ...commands,
            ].join("\n"),
          );
        }),

      overload({ commandName: t.string("command") })
        .description("Get help on a specific command")
        .execute((ctx, { commandName }) => {
          const command = ctx.manager.commands.get(commandName);
          if (command === undefined) {
            ctx.player.sendMessage(c.error("Unknown command."));
            return;
          }

          const banner = `${"-".repeat(10)}[${c.highlight(`${ctx.manager.prefix}help ${c.mute(command.name)}`)}]${"-".repeat(10)}`;

          const signatures = command.overloads.map((overload) =>
            [
              `${c.highlight(ctx.manager.prefix + command.name)}`,
              ...[...Object.values(overload.parameters)].map((param) => c.mute(param.getSignature())),
              overload.description,
            ]
              .filter((v) => v)
              .join(" "),
          );

          ctx.player.sendMessage(
            [
              banner,
              [command.name, ...command.aliases].map((s) => c.highlight(ctx.manager.prefix + s)).join(c.mute(", ")),
              command.description,
              " ",
              ...signatures,
            ]
              .filter((v) => v)
              .join("\n"),
          );
        }),
    );
}
