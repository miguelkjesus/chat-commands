import type { LocationParameter } from "~/parameters/types";
import { ParameterBuilder } from "./parameter-builder";

/**
 * A builder for creating and configuring a location parameter. \
 * Location parameters allow the player to input a set of three coordinates (X, Y, Z), typically a location.
 *
 * **Note:** Location parameters **should not** be created this way. Instead use `location()`
 */
export class LocationParameterBuilder extends ParameterBuilder<LocationParameter> {}
