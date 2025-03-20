import { Vector3ParameterBuilder } from "~/builders";
import { Vector3Parameter } from "~/parameters/types";

/**
 * Creates a 3D vector parameter for use in overload definitions. \
 * This parameter allows the player to input a set of three coordinates (X, Y, Z).
 *
 * **Example Inputs:**
 * - `!teleport 100 64 -200`
 * - `!setspawn ~ ~ ~`
 *
 * @example
 * overload({ location: vector3() });
 *
 * @param name
 *    An optional display name for the parameter. \
 *    This name will be displayed in help menus and should indicate what the parameter represents.
 *
 *    If omitted, it defaults to the key used in the overload definition.
 * @returns
 *    A builder instance for configuring the parameter.
 */
export function vector3(name?: string) {
  return new Vector3ParameterBuilder(new Vector3Parameter(name));
}
