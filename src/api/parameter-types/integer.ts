import { IntegerParameterBuilder } from "~/builders";
import { IntegerParameter } from "~/parameters/types";

/**
 * Creates a integer parameter for use in overload definitions. \
 * Integer parameters allow the player to input any whole number: e.g.,
 *
 * **Example inputs:**
 * - `!repeat 5 Hello world!`
 * - `!help 3`
 *
 * @example
 * giveMoney.createOverload({ amount: integer().min(0) });
 * // Restricts input to integers >= 0.
 *
 * @param name
 *    An optional display name for the parameter. \
 *    This name will be displayed in help menus and should convey what the parameter represents.
 *
 *    If omitted, this will default to the key used in the overload definition.
 * @returns
 *    A builder instance for configuring the parameter.
 */
export function integer(name?: string) {
  return new IntegerParameterBuilder(new IntegerParameter(name));
}
