import { Vector3 } from "@minecraft/server";
import { Parameter, ParameterParseContext } from "./parameter";

export class Vector3Parameter<Name extends string> extends Parameter<Vector3, Name> {
  parse({ tokens }: ParameterParseContext): Vector3 {
    // TODO: implement ~ and ^ syntax
    // TODO: error handling
    const [x, y, z] = tokens.popSome(3).map(parseFloat);
    return { x, y, z };
  }
}
