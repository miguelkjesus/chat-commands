import type { PlayerParameter } from "~/parameters/types";
import { ParameterBuilder } from "./parameter-builder";

/**
 * A builder for creating and configuring a player parameter. \
 * Player parameters allow the player to input the name of any online player.
 *
 * **Note:** Player parameters **should not** be created this way. Instead use `player()`
 */
export class PlayerParameterBuilder extends ParameterBuilder<PlayerParameter> {}
