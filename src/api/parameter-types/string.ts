import { StringParameterBuilder } from "~/builders";
import { StringParameter } from "~/parameters/types";

/**
 * Creates a string parameter for use in overload definitions. \
 * String parameters allow the player to input any text value.
 *
 * **Example Inputs:**
 * - `!rename diamond_sword Excalibur`
 * - `!shout Hello, world!`
 *
 * @example
 * overload({ description: string().maxLength(50) });
 * // Restricts input to strings of at most 50 characters
 *
 * overload({ message: string().notEmpty() })
 * // Disallows empty strings
 *
 * @param name
 *    An optional display name for the parameter. \
 *    This name will be displayed in help menus and should convey what the parameter represents.
 *
 *    If omitted, it defaults to the key used in the overload definition.
 * @returns
 *    A builder instance for configuring the parameter.
 */
export function string(name?: string) {
  return new StringParameterBuilder(new StringParameter(name));
}
