import { TargetSelectorParameterBuilder } from "~/builders";
import { TargetSelectorParameter } from "~/parameters";

/**
 * Creates an target selector parameter for use in overload definitions. \
 * Target selector parameters allow the player use a target selector to specify any number of entities, e.g.
 *
 * **Example inputs:**
 * - `!smite TheLegend27`
 * - `!smite \@e[type=!player]` (ignore the "\\")
 *
 * @example
 * smite.createOverload({ victims: targetSelector() });
 *
 * @param name
 *    An optional display name for the parameter. \
 *    This name will be displayed in help menus and should convey what the parameter represents.
 *
 *    If omitted, this will default to the key used in the overload definition.
 * @returns
 *    A builder instance for configuring the parameter.
 */
export function targetSelector(name?: string) {
  return new TargetSelectorParameterBuilder(new TargetSelectorParameter(name));
}
