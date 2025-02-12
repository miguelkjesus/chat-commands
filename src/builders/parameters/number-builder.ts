import type { NumberParameter } from "~/parameters";
import { NumberRange } from "~/utils/range";

import { ParameterBuilder } from "./parameter-builder";

export class NumberParameterBuilder extends ParameterBuilder<NumberParameter> {
  allowNaN(allowNaN: boolean) {
    return this.__set({ allowNaN });
  }

  allowInf(allowInf: boolean) {
    return this.__set({ allowInf });
  }

  gt(gt: number) {
    this.__default({ range: new NumberRange({}) });
    return this.__modify(
      ({ range }) => (range.min = { inclusive: false, value: gt })
    );
  }

  gte(gte: number) {
    this.__default({ range: new NumberRange({}) });
    return this.__modify(
      ({ range }) => (range.min = { inclusive: true, value: gte })
    );
  }

  lt(lt: number) {
    this.__default({ range: new NumberRange({}) });
    return this.__modify(
      ({ range }) => (range.max = { inclusive: false, value: lt })
    );
  }

  lte(lte: number) {
    this.__default({ range: new NumberRange({}) });
    return this.__modify(
      ({ range }) => (range.max = { inclusive: true, value: lte })
    );
  }
}
