import type { NumberParameter } from "~/parameters";
import { NumberRange } from "~/utils/range";

import { ParameterBuilder } from "./parameter-builder";

export class NumberParameterBuilder<Name extends string> extends ParameterBuilder<NumberParameter<Name>> {
  allowNaN(allowNaN: boolean) {
    return this.__set({ allowNaN });
  }

  allowInf(allowInf: boolean) {
    return this.__set({ allowInf });
  }

  gt(gt: number) {
    this.__default({ range: new NumberRange({}) });
    return this.__mutate(({ range }) => (range.min = { inclusive: false, value: gt }));
  }

  gte(gte: number) {
    this.__default({ range: new NumberRange({}) });
    return this.__mutate(({ range }) => (range.min = { inclusive: true, value: gte }));
  }

  lt(lt: number) {
    this.__default({ range: new NumberRange({}) });
    return this.__mutate(({ range }) => (range.max = { inclusive: false, value: lt }));
  }

  lte(lte: number) {
    this.__default({ range: new NumberRange({}) });
    return this.__mutate(({ range }) => (range.max = { inclusive: true, value: lte }));
  }
}
