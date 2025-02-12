import { NumberParameterBuilder } from "~/builders";
import { NumberParameter } from "~/parameters";

export function number(name: string) {
  return new NumberParameterBuilder(new NumberParameter(name));
}
