import type { TargetSelectorParameter } from "~/parameters/types";
import { ParameterBuilder } from "./parameter-builder";

/**
 * A builder for creating and configuring a target selector parameter. \
 * Target selector parameters allow the player use a target selector to specify any number of entities.
 *
 * **Note:** Target selector parameters **should not** be created this way. Instead use `targetSelector()`
 */
export class TargetSelectorParameterBuilder extends ParameterBuilder<TargetSelectorParameter> {
  /**
   * Sets the minimum amount of entities that can be selected.
   *
   * @example
   * overload({ entities: targetSelector().setMinCount(10) })
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
   * overload({ entities: targetSelector().setMaxCount(50) })
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
}
