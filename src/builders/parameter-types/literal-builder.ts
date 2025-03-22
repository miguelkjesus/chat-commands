import { LiteralParameter } from "~/parameters/types";
import { ParameterBuilder } from "./parameter-builder";

/**
 * A builder for creating and configuring a literal parameter. \
 * Literal parameters restrict the player's input to specific keywords.
 *
 * **Note:** Literal parameters **should not** be created this way. Instead use `literal()`
 */
export class LiteralParameterBuilder<
  const Choices extends readonly string[] = readonly string[],
> extends ParameterBuilder<LiteralParameter<Choices>> {}
