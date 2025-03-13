import { Player, Vector3 } from "@minecraft/server";

import type { Entries } from "~/utils/types";
import type { Vector3Token } from "~/tokens/parsers";
import { ParseError } from "~/errors";

import type { ParameterParseTokenContext, ParameterParseValueContext } from "../parameter-parse-context";
import { Parameter } from "./parameter";

export class Vector3Parameter extends Parameter<Vector3, Vector3Token> {
  typeName = "x y z";

  parseToken({ tokens, parsers }: ParameterParseTokenContext) {
    return tokens.pop(parsers.vector3);
  }

  parseValue({ token, player }: ParameterParseValueContext<Vector3Token>): Vector3 {
    let location = {} as Vector3;
    let deltaLocation = {} as Vector3; // Only used in local (^) mode

    let hasAbsolute = false;
    let hasRelative = false;
    let hasLocal = false;

    for (const [axis, component] of Object.entries(token) as Entries<Vector3Token>) {
      if (component.type === "relative") {
        hasRelative = true;
        location[axis] = component.value;
      } else if (component.type === "local") {
        hasLocal = true;
        deltaLocation[axis] = component.value;
      } else {
        hasAbsolute = true;
        location[axis] = component.value;
      }
    }

    if (hasLocal && (hasAbsolute || hasRelative)) {
      throw new ParseError("Cannot mix local (^) coordinates with relative (~) coordinates or absolute coordinates.");
    }

    if (hasLocal) {
      const { forward, right, up } = getRotationVectors(player);
      location = {
        x: player.location.x + deltaLocation.x * right.x + deltaLocation.y * up.x + deltaLocation.z * forward.x,
        y: player.location.y + deltaLocation.x * right.y + deltaLocation.y * up.y + deltaLocation.z * forward.y,
        z: player.location.z + deltaLocation.x * right.z + deltaLocation.y * up.z + deltaLocation.z * forward.z,
      };
    }

    return location;
  }
}

function getRotationVectors(player: Player) {
  const rot = player.getRotation();

  const yaw = (rot.y * Math.PI) / 180;
  const pitch = (rot.x * Math.PI) / 180;

  const cy = Math.cos(yaw);
  const sy = Math.sin(yaw);
  const cp = Math.cos(pitch);
  const sp = Math.sin(pitch);

  return {
    forward: { x: -cp * sy, y: -sp, z: cp * cy } as Vector3,
    right: { x: cy, y: 0, z: -sy } as Vector3,
    up: { x: sp * sy, y: cp, z: -sp * cy } as Vector3,
  };
}
