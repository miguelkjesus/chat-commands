import { LiteralParameterBuilder } from "~/builders";
import { LiteralParameter } from "~/parameters";

/**
 * Creates a literal parameter with predefined choices for use in an overload definition. \
 * Literal parameters restrict the player's input to specific keywords.
 *
 * @example
 * overload({ mode: literal("easy", "normal", "hard") });
 * // The "mode" parameter can only be "easy", "normal", or "hard".
 *
 * @param choices
 *    The allowed string values for this parameter.
 * @returns
 *    A builder instance for configuring the parameter.
 */
export function literal<const Choices extends readonly string[]>(...choices: Choices) {
  return new LiteralParameterBuilder(new LiteralParameter(...choices));
}
