import { LiteralParameterBuilder } from "~/builders";
import { LiteralParameter } from "~/parameters/types";

export function literal<const Choices extends readonly string[]>(...choices: Choices) {
  return new LiteralParameterBuilder(new LiteralParameter(...choices));
}
