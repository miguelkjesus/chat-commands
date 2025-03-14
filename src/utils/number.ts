import { ParseError } from "~/errors";

export function parseNumber(str: string): number {
  const n = parseFloat(str);

  if (Number.isNaN(n)) {
    throw new ParseError("Expected a number.");
  }

  if (!Number.isFinite(n)) {
    throw new ParseError("Expected a finite number.");
  }

  return n;
}

export function parseOptionalNumber(str: string): number | undefined {
  return str === "" ? undefined : parseNumber(str);
}
