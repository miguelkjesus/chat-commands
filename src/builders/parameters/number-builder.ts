import type { NumberParameter } from "~/parameters";
import { ParameterBuilder } from "./parameter-builder";

export class NumberParameterBuilder extends ParameterBuilder<NumberParameter> {
  allowNaN(allowNaN: boolean) {
    return this.__set({ allowNaN });
  }

  allowInf(allowInf: boolean) {
    return this.__set({ allowInf });
  }

  gt(gt: number) {
    return this.__mutate(({ range }) => (range!.min = { inclusive: false, value: gt }));
  }

  gte(gte: number) {
    return this.__mutate(({ range }) => (range!.min = { inclusive: true, value: gte }));
  }

  lt(lt: number) {
    return this.__mutate(({ range }) => (range!.max = { inclusive: false, value: lt }));
  }

  lte(lte: number) {
    return this.__mutate(({ range }) => (range!.max = { inclusive: true, value: lte }));
  }
}
