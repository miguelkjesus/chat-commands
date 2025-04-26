import { LocationParameterBuilder } from "~/builders";
import { LocationParameter } from "~/parameters/types";

/**
 * Creates a 3D vector parameter for use in overload definitions. \
 * Location parameters allow the player to input a set of three coordinates (X, Y, Z), typically a location: e.g.,
 *
 * **Example Inputs:**
 * - `!teleport 100 64 -200`
 * - `!spawn set ~ ~ ~`
 *
 * @example
 * overload({ location: location() });
 *
 * @param name
 *    An optional display name for the parameter. \
 *    This name will be displayed in help menus and should convey what the parameter represents.
 *
 *    If omitted, it defaults to the key used in the overload definition.
 * @returns
 *    A builder instance for configuring the parameter.
 */
export function location(name?: string) {
  return new LocationParameterBuilder(new LocationParameter(name));
}
