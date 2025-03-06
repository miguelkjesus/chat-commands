import { Vector3ParameterBuilder } from "~/builders";
import { Vector3Parameter } from "~/parameters/types";

export function vector3(name?: string) {
  return new Vector3ParameterBuilder(new Vector3Parameter(name));
}
