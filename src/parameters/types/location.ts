import type { Vector3 } from "@minecraft/server";

import { LocationParser } from "~/tokens/parsers";

import type { ParameterParseTokenContext, ParameterParseValueContext } from "../parameter-parse-context";
import { Parameter } from "./parameter";

export class LocationParameter extends Parameter<Vector3, Vector3> {
  typeName = "x y z";

  parseToken({ stream, player }: ParameterParseTokenContext) {
    return stream.pop(new LocationParser(player));
  }

  parseValue({ token }: ParameterParseValueContext<Vector3>) {
    return token.value;
  }
}
