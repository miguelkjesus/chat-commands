import { StringParameterBuilder } from "~/builders";
import { StringParameter } from "~/parameters/types";

export function string(name?: string) {
  return new StringParameterBuilder(new StringParameter(name));
}
