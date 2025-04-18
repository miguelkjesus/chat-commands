import type { Player, Vector3 } from "@minecraft/server";

import type { Entries } from "~/utils/types";

import type { TokenSubstream } from "../stream";
import { Token, TokenParser } from "../token";

import { LocationComponentParser, LocationComponentToken } from "./location-component-parser";

export class LocationParser extends TokenParser<Vector3> {
  readonly player: Player;

  constructor(player: Player) {
    super();
    this.player = player;
  }

  parse(stream: TokenSubstream): Token<Vector3> {
    const result = this.tokenise(stream);
    return result.map((token) => this.resolve(token));
  }

  tokenise(stream: TokenSubstream): Token<LocationToken> {
    const components = ["x", "y", "z"] as const;

    let hasNonLocal = false;
    let hasLocal = false;

    const token = {} as LocationToken;

    for (const component of components) {
      const componentToken = stream.pop(new LocationComponentParser(component));

      if (componentToken.value.type === "local") {
        hasLocal = true;
      } else {
        hasNonLocal = true;
      }

      if (hasLocal && hasNonLocal) {
        throw componentToken.error(
          "Cannot mix local (^) coordinates with relative (~) coordinates or absolute coordinates.",
        ).state;
      }

      token[component] = componentToken.value;
    }

    return stream.token(token);
  }

  resolve(token: LocationToken): Vector3 {
    let location = {} as Vector3;
    let deltaLocation = {} as Vector3; // Only used in local (^) mode

    let hasNonLocal = false;
    let hasLocal = false;

    for (const [axis, component] of Object.entries(token) as Entries<LocationToken>) {
      if (component.type === "relative") {
        hasNonLocal = true;
        location[axis] = component.value;
      } else if (component.type === "local") {
        hasLocal = true;
        deltaLocation[axis] = component.value;
      } else {
        hasNonLocal = true;
        location[axis] = component.value;
      }
    }

    if (hasLocal && hasNonLocal) {
      // This error should be caught earlier.
      throw new Error("Invalid location token.");
    }

    if (hasLocal) {
      const { forward, right, up } = getRotationVectors(this.player);
      location = {
        x: this.player.location.x + deltaLocation.x * right.x + deltaLocation.y * up.x + deltaLocation.z * forward.x,
        y: this.player.location.y + deltaLocation.x * right.y + deltaLocation.y * up.y + deltaLocation.z * forward.y,
        z: this.player.location.z + deltaLocation.x * right.z + deltaLocation.y * up.z + deltaLocation.z * forward.z,
      };
    }

    return location;
  }
}

export interface LocationToken {
  x: LocationComponentToken;
  y: LocationComponentToken;
  z: LocationComponentToken;
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
