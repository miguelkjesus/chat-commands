import { EntityParameterBuilder } from "~/builders";
import { EntityParameter } from "~/parameters";

export function entity(name?: string) {
  return new EntityParameterBuilder(new EntityParameter(name));
}
