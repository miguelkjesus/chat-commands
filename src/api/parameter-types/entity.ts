import { EntityParameterBuilder } from "~/builders";
import { EntityParameter } from "~/parameters";

/**
 * Creates an entity parameter for use in overload definitions. \
 * Entity parameters allow the player to target one or more entities (e.g., players, mobs): e.g.,
 *
 * **Example inputs:**
 * - `!smite TheLegend27`
 * - `!smite \@e[type=!player]` (ignore the "\\")
 *
 * @example
 * smite.createOverload({ victim: entity() });
 *
 * @param name
 *    An optional display name for the parameter. \
 *    This name will be displayed in help menus and should convey what the parameter represents.
 *
 *    If omitted, this will default to the key used in the overload definition.
 * @returns
 *    A builder instance for configuring the parameter.
 */
export function entity(name?: string) {
  return new EntityParameterBuilder(new EntityParameter(name));
}
