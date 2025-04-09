import type { Simplify } from "~/utils/types";
import * as parameterTypes from "./parameter-types";

/**
 * An object containing all the parameter types.
 */
export type Parameters = Readonly<Simplify<typeof parameterTypes>>;

/**
 * An object containing all the parameter types.
 */
export const Parameters = { ...parameterTypes } as Parameters;

/**
 * An object containing all the parameter types.
 *
 * Alias for `Parameters`.
 */
export const p = Parameters;
