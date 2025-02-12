import { StringParameterBuilder } from "~/builders";
import { StringParameter } from "~/parameters";

export function string<Name extends string>(name: Name) {
  return new StringParameterBuilder(new StringParameter(name));
}
