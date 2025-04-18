import { system } from "@minecraft/server";

export class CooldownManager {
  private triggers = new Map<string, { triggeredAtTick: number; deleteTriggerTimeoutId: number }>();
  private _cooldownTicks: number;

  constructor(cooldownTicks = 0) {
    this.cooldownTicks = cooldownTicks;
  }

  get cooldownTicks() {
    return this._cooldownTicks;
  }

  set cooldownTicks(value: number) {
    this._cooldownTicks = value;

    for (const [entityId, info] of this.triggers.entries()) {
      system.clearRun(info.deleteTriggerTimeoutId);

      info.deleteTriggerTimeoutId = system.runTimeout(
        () => {
          this.triggers.delete(entityId);
        },
        this._cooldownTicks - system.currentTick - info.triggeredAtTick,
      );
    }
  }

  getRemainingTicks(entityId: string) {
    const lastExecutedTick = this.triggers.get(entityId)?.triggeredAtTick ?? 0;
    return Math.max(0, this.cooldownTicks - (system.currentTick - lastExecutedTick));
  }

  clear(entityId: string) {
    const runId = this.triggers.get(entityId)?.deleteTriggerTimeoutId;

    if (runId) {
      system.clearRun(runId);
    }

    this.triggers.delete(entityId);
  }

  trigger(entityId: string): void {
    this.clear(entityId);

    const runId = system.runTimeout(() => {
      this.triggers.delete(entityId);
    }, this.cooldownTicks);

    this.triggers.set(entityId, {
      triggeredAtTick: system.currentTick,
      deleteTriggerTimeoutId: runId,
    });
  }
}
