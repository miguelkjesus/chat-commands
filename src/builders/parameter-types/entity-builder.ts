import type { EntityParameter } from "~/parameters/types";
import { ParameterBuilder } from "./parameter-builder";

/**
 * A builder for creating and configuring an entity parameter. \
 * Entity parameters allow the player to target one or more entities (e.g., players, mobs)
 *
 * **Note:** Entity parameters **should not** be created this way. Instead use `entity()`
 */
export class EntityParameterBuilder extends ParameterBuilder<EntityParameter> {}
