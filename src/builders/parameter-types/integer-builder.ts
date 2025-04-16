import type { IntegerParameter } from "~/parameters/types";
import { ParameterBuilder } from "./parameter-builder";

/**
 * A builder for creating and configuring a integer parameter. \
 * Integer parameters allow the player to input any whole number.
 *
 * **Note:** Integer parameters **should not** be created this way. Instead use `integer()`
 */
export class IntegerParameterBuilder extends ParameterBuilder<IntegerParameter> {
  /**
   * Restricts the input to numbers at least some value.
   *
   * @example
   * overload({ amount: integer().setMin(10) })
   * // Restricts the input to any number >= 10.
   *
   * @param min
   *    What the minimum input should be.
   * @returns
   *    The current builder instance.
   */
  setMin(min: number) {
    this.state.range.min = min;
    return this;
  }

  /**
   * Restricts the input to numbers at most some value.
   *
   * @example
   * overload({ amount: integer().setMax(50) })
   * // Restricts the input to any number <= 50.
   *
   * @param max
   *    What the maximum input should be.
   * @returns
   *    The current builder instance.
   */
  setMax(max: number) {
    this.state.range.max = max;
    return this;
  }
}
