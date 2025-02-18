import { EntityParameterBuilder } from "~/builders";
import { EntityParameter } from "~/parameters";

export function entity<Name extends string>(name: Name) {
  return new EntityParameterBuilder(new EntityParameter(name));
}
