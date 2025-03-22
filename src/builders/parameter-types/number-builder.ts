import type { NumberParameter } from "~/parameters/types";
import { ParameterBuilder } from "./parameter-builder";

/**
 * A builder for creating and configuring a number parameter. \
 * Number parameters allow the player to input any number.
 *
 * **Note:** Number parameters **should not** be created this way. Instead use `number()`
 */
export class NumberParameterBuilder extends ParameterBuilder<NumberParameter> {
  /**
   * By default, the parameter will produce an error if the player inputs a non-numeric value, e.g.:
   * - `!give money banana` → ❌ Invalid input
   *
   * Enabling this option allows the parameter to return `NaN` instead of throwing an error.
   *
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/parseFloat#parsefloat_returning_nan | When does parseFloat() return NaN?}
   *
   * @example
   * overload({ amount: number().allowNaN() })
   * // "banana" will not error and instead return NaN.
   *
   * @param allowNaN
   *    Whether to allow `NaN` as a valid value.
   * @returns
   *    A builder instance for configuring the parameter.
   */
  allowNaN(allowNaN = true) {
    this.state.allowNaN = allowNaN;
    return this;
  }

  /**
   * Allows or disallows infinity as a valid input.
   *
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/parseFloat#returning_infinity | When does parseFloat() return Infinity?}
   *
   * @example
   * overload({ amount: number().allowInf() })
   * // "Infinity" will no longer error and now return Infinity
   *
   * @param allowInf
   *    Whether to allow `Infinity` as a valid value.
   * @returns
   *    A builder instance for configuring the parameter.
   */
  allowInf(allowInf = true) {
    this.state.allowInf = allowInf;
    return this;
  }

  /**
   * Restricts the input to numbers greater than some value.
   *
   * @example
   * overload({ amount: number().gt(10) })
   * // Restricts the input to any number > 10.
   *
   * @param gt
   *    What the input should be greater than.
   * @returns
   *    The current builder instance.
   */
  gt(gt: number) {
    this.state.range.min = { inclusive: false, value: gt };
    return this;
  }

  /**
   * Restricts the input to numbers greater than or equal to some value.
   *
   * @example
   * overload({ amount: number().gte(10) })
   * // Restricts the input to any number >= 10.
   *
   * @param gt
   *    What the input should be greater than or equal to.
   * @returns
   *    The current builder instance.
   */
  gte(gte: number) {
    this.state.range.min = { inclusive: true, value: gte };
    return this;
  }

  /**
   * Restricts the input to numbers less than some value.
   *
   * @example
   * overload({ amount: number().lt(10) })
   * // Restricts the input to any number < 10.
   *
   * @param gt
   *    What the input should be less than.
   * @returns
   *    The current builder instance.
   */
  lt(lt: number) {
    this.state.range.min = { inclusive: false, value: lt };
    return this;
  }

  /**
   * Restricts the input to numbers less than or equal to some value.
   *
   * @example
   * overload({ amount: number().lte(10) })
   * // Restricts the input to any number <= 10.
   *
   * @param gt
   *    What the input should be less than or equal to.
   * @returns
   *    The current builder instance.
   */
  lte(lte: number) {
    this.state.range.min = { inclusive: true, value: lte };
    return this;
  }
}
