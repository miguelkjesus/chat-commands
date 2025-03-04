import { LiteralParameterBuilder } from "~/builders";
import { LiteralParameter } from "~/parameters";

export function literal(name?: string) {
  return new LiteralParameterBuilder(new LiteralParameter(name));
}
