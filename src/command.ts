import { ChatSendBeforeEvent, Player } from "@minecraft/server";

import { CommandManager } from "./command-manager";
import { Resolvable } from "./resolvers";
import { Parameter } from "./parameters/parameter";
import { bound } from "./utils/decorators";
import { TokenStream } from "./token-stream";

export class Command {
  parent?: Command | CommandManager;

  name: string;
  description?: Resolvable<(player: Player) => string>;
  checks: Resolvable<(player: Player) => boolean>[] = [];
  overloads: Parameter[][] = [];
  subcommands: Command[] = [];

  @bound accessor execute: (ctx: Invocation) => void = () => {};

  get fullName(): string | undefined {
    if (this.parent instanceof CommandManager) {
      return this.parent.prefix + this.name;
    }

    if (this.parent instanceof Command) {
      return this.parent.fullName + " " + this.name;
    }
  }

  constructor(name: string) {
    this.name = name;
  }

  parse(stream: TokenStream): void {
    // TODO!
  }
}

export class Invocation {
  readonly player: Player;
  readonly message: string;

  constructor(player: Player, message: string) {
    this.player = player;
    this.message = message;
  }

  static fromChatEvent(event: ChatSendBeforeEvent): Invocation {
    return new Invocation(event.sender, event.message);
  }
}
