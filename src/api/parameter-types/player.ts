import { PlayerParameterBuilder } from "~/builders";
import { PlayerParameter } from "~/parameters/types";

export function player(name?: string) {
  return new PlayerParameterBuilder(new PlayerParameter(name));
}
