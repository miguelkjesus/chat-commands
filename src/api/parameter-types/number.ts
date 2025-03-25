import { NumberParameterBuilder } from "~/builders";
import { NumberParameter } from "~/parameters/types";

/**
 * Creates a number parameter for use in overload definitions. \
 * Number parameters allow the player to input any number: e.g.,
 *
 * **Example inputs:**
 * - `!money give 2.50`
 * - `!help 3`
 *
 * @example
 * giveMoney.createOverload({ amount: number().gt(0) });
 * // Restricts input to numbers greater than 0
 *
 * @param name
 *    An optional display name for the parameter. \
 *    This name will be displayed in help menus and should convey what the parameter represents.
 *
 *    If omitted, this will default to the key used in the overload definition.
 * @returns
 *    A builder instance for configuring the parameter.
 */
export function number(name?: string) {
  return new NumberParameterBuilder(new NumberParameter(name));
}
