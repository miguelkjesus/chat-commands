import type { EntityParameter } from "~/parameters";
import { ParameterBuilder } from "./parameter-builder";

export class EntityParameterBuilder<Name extends string> extends ParameterBuilder<EntityParameter<Name>> {}
