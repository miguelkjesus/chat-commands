import type { Simplify } from "~/utils/types";
import * as parameterTypes from "./parameter-types";

export type ParameterTypes = Simplify<typeof parameterTypes>;
export const params = Object.freeze({ ...parameterTypes }) as ParameterTypes;
export const p = params; // Alias for `params`
