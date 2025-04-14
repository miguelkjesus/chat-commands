import type { LocationParameter } from "~/parameters/types";
import { ParameterBuilder } from "./parameter-builder";

/**
 * A builder for creating and configuring a vector3 parameter. \
 * Vector3 parameters allow the player to input a set of three coordinates (X, Y, Z), typically a location.
 *
 * **Note:** Vector3 parameters **should not** be created this way. Instead use `vector3()`
 */
export class Vector3ParameterBuilder extends ParameterBuilder<LocationParameter> {}
