import type { ChatSendBeforeEvent, Player } from "@minecraft/server";
import type { CommandManager } from "./command-manager";

export class Invocation {
  readonly manager: CommandManager;
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
