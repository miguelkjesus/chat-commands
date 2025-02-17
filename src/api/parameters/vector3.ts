import { Vector3ParameterBuilder } from "~/builders";
import { Vector3Parameter } from "~/parameters";

export function vector3<Name extends string>(name: Name) {
  return new Vector3ParameterBuilder(new Vector3Parameter(name));
}
