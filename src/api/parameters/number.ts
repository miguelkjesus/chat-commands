import { NumberParameterBuilder } from "~/builders";
import { NumberParameter } from "~/parameters/types";

export function number(name?: string) {
  return new NumberParameterBuilder(new NumberParameter(name));
}
