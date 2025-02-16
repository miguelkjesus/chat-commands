import type { Vector3Parameter } from "~/parameters";
import { ParameterBuilder } from "./parameter-builder";

export class Vector3ParameterBuilder<Name extends string> extends ParameterBuilder<Vector3Parameter<Name>> {}
