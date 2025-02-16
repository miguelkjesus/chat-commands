import { EntityParameterBuilder } from "~/builders/parameters/entity-builder";
import { EntityParameter } from "~/parameters";

export function entity<Name extends string>(name: Name) {
  return new EntityParameterBuilder(new EntityParameter(name));
}
