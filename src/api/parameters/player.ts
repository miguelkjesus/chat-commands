import { PlayerParameterBuilder } from "~/builders";
import { PlayerParameter } from "~/parameters";

export function player<Name extends string>(name: Name) {
  return new PlayerParameterBuilder(new PlayerParameter(name));
}
