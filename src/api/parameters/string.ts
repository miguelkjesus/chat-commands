import { StringParameterBuilder } from "~/builders";
import { StringParameter } from "~/parameters";

export function string(name?: string) {
  return new StringParameterBuilder(new StringParameter(name));
}
