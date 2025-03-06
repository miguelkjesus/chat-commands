import { LiteralParameterBuilder } from "~/builders";
import { LiteralParameter } from "~/parameters/types";

export function literal(name?: string) {
  return new LiteralParameterBuilder(new LiteralParameter(name));
}
