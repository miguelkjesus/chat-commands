import type { EntityParameter } from "~/parameters/types";
import { ParameterBuilder } from "./parameter-builder";

/**
 * A builder for creating and configuring an entity parameter. \
 * Entity parameters allow the player to specify a player name or use a target selector to specify any number of entities.
 *
 * **Note:** Target selector parameters **should not** be created this way. Instead use `entity()`
 */
export class EntityParameterBuilder extends ParameterBuilder<EntityParameter> {
  /**
   * Sets the minimum amount of entities that can be selected.
   *
   * @example
   * overload({ entities: entity().setMinCount(10) })
   * // Ensures that the target selector matches at least 10 entities.
   *
   * @param minCount
   *    What the minimum entity count should be.
   * @returns
   *    The current builder instance.
   */
  setMinCount(minCount: number) {
    this.state.minCount = minCount;
    return this;
  }

  /**
   * Sets the maximum amount of entities that can be selected.
   *
   * @example
   * overload({ entities: entity().setMaxCount(50) })
   * // Ensures that the target selector matches at least 50 entities.
   *
   * @param maxCount
   *    What the maximum entity count should be.
   * @returns
   *    The current builder instance.
   */
  setMaxCount(maxCount: number) {
    this.state.maxCount = maxCount;
    return this;
  }

  /**
   * Sets the exact number of entities that should be selected.
   *
   * @example
   * overload({ entities: entity().setCount(1) })
   * // Ensures that the target selector only matches 1 entity.
   *
   * @param count
   *    What the entity count should be.
   * @returns
   *    The current builder instance.
   */
  setCount(count: number) {
    this.state.minCount = count;
    this.state.maxCount = count;
    return this;
  }
}
