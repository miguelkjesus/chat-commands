import { NumberParameterBuilder } from "~/builders";
import { NumberParameter } from "~/parameters";

export function number<Name extends string>(name: Name) {
  return new NumberParameterBuilder(new NumberParameter(name));
}
