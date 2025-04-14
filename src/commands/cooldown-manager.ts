import { system, world } from "@minecraft/server";

export class CooldownManager {
  cooldownTicks: number;
  playerTriggeredAtTicks = new Map<string, number>();

  constructor(cooldownTicks = 0) {
    this.cooldownTicks = cooldownTicks;

    world.afterEvents.playerLeave.subscribe((event) => {
      this.playerTriggeredAtTicks.delete(event.playerId);
    });
  }

  getRemainingTicks(playerId: string): number {
    const lastExecutedTick = this.playerTriggeredAtTicks.get(playerId) ?? 0;
    return Math.max(0, this.cooldownTicks - (system.currentTick - lastExecutedTick));
  }

  trigger(playerId: string): void {
    this.playerTriggeredAtTicks.set(playerId, system.currentTick);
  }
}
