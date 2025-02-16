import type { PlayerParameter } from "~/parameters";
import { ParameterBuilder } from "./parameter-builder";

export class PlayerParameterBuilder<Name extends string> extends ParameterBuilder<PlayerParameter<Name>> {}
