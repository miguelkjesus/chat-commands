import { ParseError } from "~/errors";
import { TokenParserResult } from "./parser";

export interface VectorComponentToken {
  type: "local" | "relative" | "absolute";
  value: number;
}

export interface Vector3Token {
  x: VectorComponentToken;
  y: VectorComponentToken;
  z: VectorComponentToken;
}

export function vector3(unparsed: string): TokenParserResult<Vector3Token> {
  unparsed = unparsed.trim();

  const parts: string[] = [];
  let current = "";

  for (let i = 0; i < unparsed.length; i++) {
    const ch = unparsed[i];

    if (parts.length === 3) {
      unparsed = unparsed.slice(i - 1);
      break;
    } else if (" ~^".includes(ch) && current) {
      parts.push(current);
      current = "";
    } else {
      current += ch;
    }
  }

  if (current) parts.push(current);

  const [x, y, z] = parts.map((value: string): VectorComponentToken => {
    if (value.startsWith("~")) {
      return { type: "relative", value: parseOptionalNumber(value.slice(1)) ?? 0 };
    } else if (value.startsWith("^")) {
      return { type: "local", value: parseOptionalNumber(value.slice(1)) ?? 0 };
    } else {
      return { type: "absolute", value: parseNumber(value) };
    }
  });

  // Throw this after the mapping, because parse errors for each component
  // should be thrown before this.
  if (parts.length !== 3) {
    throw new ParseError(`Missing ${"xyz"[parts.length]} component of the vector.`);
  }

  return { unparsed: "", token: { x, y, z } };
}

function parseNumber(str: string): number {
  const n = parseFloat(str);

  if (Number.isNaN(n)) {
    throw new ParseError("Expected a number.");
  }

  if (!Number.isFinite(n)) {
    throw new ParseError("Expected a finite number.");
  }

  return n;
}

function parseOptionalNumber(str: string): number | undefined {
  return str === "" ? undefined : parseNumber(str);
}
