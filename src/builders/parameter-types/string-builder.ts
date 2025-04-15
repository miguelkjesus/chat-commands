import type { StringParameter } from "~/parameters/types";
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
   * shout.createOverload({ message: string().notEmpty() });
   * // !shout "" -> ❌ Must not be an empty string.
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
   * rename.createOverload({ name: string().minLength(5) })
   * // !rename abc -> ❌ Must be at least 5 characters.
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
   * setBio.createOverload({ bio: string().maxLength(200) })
   * // !bio set ... (201 characters) -> ❌ Must be at most 200 characters.
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
   * setCode.createOverload({ code: string().setLength(6) })
   * // !code set 12345 -> ❌ Input must be 6 characters.
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
   * nickname.createOverload({ name: string().setLength([5, 20]) })
   * // !nickname foo -> ❌ Input must between 5 and 20 characters.
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

  /**
   * Applies a regular expression pattern to the input, validating it against the pattern.
   *
   * @example
   * setCode.createOverload({ code: string().setPattern(/^[0-9]+$/, "Code must contain only digits.") });
   * // !code set hunter2 -> ❌ Code must contain only digits.
   *
   * @param pattern
   *    The regular expression pattern to validate against.
   * @param failMessage
   *    A message to display when the input fails the pattern validation.
   * @returns
   *    The current builder instance.
   */
  setPattern(pattern: RegExp, failMessage?: string) {
    this.state.pattern = { value: pattern, failMessage };
    return this;
  }

  /**
   * Restricts the input to the given choices.
   *
   * @example
   * help.createOverload({
   *   command: string().setChoices(manager.commands.aliases(), "Invalid command name.")
   * });
   * // !setMode insane -> ❌ Input must be one of: easy, medium, hard.
   *
   * @param choices
   *    The list of valid choices for the input.
   * @returns
   *    The current builder instance.
   */
  setChoices(choices: readonly string[], failMessage?: string) {
    this.state.choices = { values: choices, failMessage };
    return this;
  }
}
