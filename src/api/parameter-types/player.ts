import { PlayerParameterBuilder } from "~/builders";
import { PlayerParameter } from "~/parameters/types";

/**
 * Creates a player parameter for use in overload definitions. \
 * This parameter allows the player to specify a target player: e.g.,
 *
 * **Example Inputs:**
 * - `!kick Notch`
 * - `!msg Steve Hello!`
 *
 * **Note:** Unlike entity parameters, this does not allow target selectors!
 *
 * @example
 * overload({ target: player() });
 *
 * @param name
 *    An optional display name for the parameter. \
 *    This name will be displayed in help menus and should indicate what the parameter represents.
 *
 *    If omitted, it defaults to the key used in the overload definition.
 * @returns
 *    A builder instance for configuring the parameter.
 */
export function player(name?: string) {
  return new PlayerParameterBuilder(new PlayerParameter(name));
}
