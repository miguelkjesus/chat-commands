import { Player, Vector3 } from "@minecraft/server";

import { ParseError } from "~/errors";

import type { ParameterParseTokenContext, ParameterParseValueContext } from "../parameter-parse-context";
import { Parameter } from "./parameter";

type Vector3Token = { x: string | undefined; y: string | undefined; z: string | undefined };

export class Vector3Parameter extends Parameter<Vector3, Vector3Token> {
  typeName = "x y z";

  parseToken({ tokens }: ParameterParseTokenContext) {
    return { x: tokens.pop(), y: tokens.pop(), z: tokens.pop() };
  }

  parseValue({ token: rawLocation, player }: ParameterParseValueContext<Vector3Token>): Vector3 {
    let location = {} as Vector3;
    let deltaLocation = {} as Vector3; // Only used in local (^) mode

    let hasAbsolute = false;
    let hasRelative = false;
    let hasLocal = false;

    for (const [axis, token] of Object.entries(rawLocation)) {
      if (token === undefined) {
        throw new ParseError(`Missing ${axis} component of the vector.`);
      }

      if (token.startsWith("~")) {
        hasRelative = true;
        const deltaToken = token.slice(1);
        const delta = deltaToken === "" ? 0 : parseFloat(deltaToken);
        location[axis] = player.location[axis] + delta;
      } else if (token.startsWith("^")) {
        hasLocal = true;
        const deltaToken = token.slice(1);
        const delta = deltaToken === "" ? 0 : parseFloat(deltaToken);
        deltaLocation[axis] = delta;
      } else {
        hasAbsolute = true;
        location[axis] = parseFloat(token);
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
