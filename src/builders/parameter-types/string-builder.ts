import { StringParameter } from "~/parameters/types";
import { ParameterBuilder } from "./parameter-builder";

/**
 * A builder for creating and configuring a string parameter. \
 * String parameters allow the player to input any text value.
 *
 * **Note:** String parameters **should not** be created this way. Instead use `string()`
 */
export class StringParameterBuilder extends ParameterBuilder<StringParameter> {
  /**
   * Disallows empty strings as valid input.
   *
   * @example
   * overload({ text: string().notEmpty() });
   * // !kick Notch "" -> ❌ Not allowed
   *
   * @param notEmpty
   *    A brief explanation of the parameter.
   * @returns
   *    A builder instance for configuring the parameter.
   */
  notEmpty(notEmpty: boolean) {
    this.state.notEmpty = notEmpty;
    return this;
  }

  /**
   * Sets the minimum accepted length of the input.
   *
   * @example
   * overload({ text: string().minLength(10) })
   * // Input must be at least 10 characters.
   *
   * @param minLength
   *    The minimum length of the input.
   * @returns
   *    The current builder instance.
   */
  minLength(minLength: number) {
    this.state.minLength = minLength;
    return this;
  }

  /**
   * Sets the maximum accepted length of the input.
   *
   * @example
   * overload({ text: string().maxLength(200) })
   * // Input must be at most 200 characters.
   *
   * @param maxLength
   *    The maximum length of the input.
   * @returns
   *    The current builder instance.
   */
  maxLength(maxLength: number) {
    this.state.maxLength = maxLength;
    return this;
  }

  /**
   * Restricts the length of the input to some value or a range of values.
   *
   * @example
   * overload({ text: string().setLength(10) })
   * // Input must be 10 characters.
   *
   * @param length
   *    The length of the input.
   * @returns
   *    The current builder instance.
   */
  setLength(length: number): this;

  /**
   * Restricts the length of the input to a range of values.
   *
   * @example
   * overload({ text: string().setLength([10, 200]) })
   * // Input must be at least 10 and at most 200 characters.
   *
   * overload({ text: string().setLength([5, null]) })
   * // The same as `.minLength(5)` and vice versa.
   *
   * @param range
   *    The range of the length of the input.
   * @returns
   *    The current builder instance.
   */
  setLength(range: [(number | null)?, (number | null)?]): this;
  setLength(arg: [(number | null)?, (number | null)?] | number) {
    const range = typeof arg === "number" ? [arg, arg] : arg;

    if (range[0]) {
      this.state.minLength = range[0];
    }

    if (range[1]) {
      this.state.maxLength = range[1];
    }

    return this;
  }

  pattern(pattern: RegExp, failMessage?: string) {
    this.state.pattern = { value: pattern, failMessage };
    return this;
  }
}
