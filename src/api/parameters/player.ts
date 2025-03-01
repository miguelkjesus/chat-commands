import { PlayerParameterBuilder } from "~/builders";
import { PlayerParameter } from "~/parameters";

export function player(name?: string) {
  return new PlayerParameterBuilder(new PlayerParameter(name));
}
