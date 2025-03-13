import { EntityParameterBuilder } from "~/builders";
import { EntityParameter } from "~/parameters/types";

export function entity(name?: string) {
  return new EntityParameterBuilder(new EntityParameter(name));
}
