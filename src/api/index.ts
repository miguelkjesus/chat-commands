import { command } from "./command";
import { overload } from "./overload";
import { entity, vector3 } from "./parameters";

export * as params from "./parameters";

export * from "./parameters";
export * from "./command-manager";
export * from "./command";

command("teleport", "tp")
  .description("Teleports things!")
  .overloads(
    overload({ destination: vector3() }).execute((ctx) => {
      ctx.player.teleport(ctx.args.destination);
      ctx.player.sendMessage("Successfully teleported!");
    }),

    overload({ targets: entity(), destination: vector3() }).execute((ctx) => {
      for (const target of ctx.args.targets) {
        target.teleport(ctx.args.destination);
      }
      ctx.player.sendMessage("Successfully teleported!");
    }),
  );
