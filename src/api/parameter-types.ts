import * as parameterTypes from "./parameters";

export type ParameterTypes = typeof parameterTypes;
export const params = {} as { readonly [K in keyof ParameterTypes]: ParameterTypes[K] };

for (const [key, factory] of Object.entries(parameterTypes)) {
  Object.defineProperty(params, key, { get: () => factory });
}

export const t = params;
