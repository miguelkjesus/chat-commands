import type { NumberParameter } from "~/parameters/types";
import { ParameterBuilder } from "./parameter-builder";

export class NumberParameterBuilder extends ParameterBuilder<NumberParameter> {
  allowNaN(allowNaN: boolean) {
    this.state.allowNaN = allowNaN;
    return this;
  }

  allowInf(allowInf: boolean) {
    this.state.allowInf = allowInf;
    return this;
  }

  gt(gt: number) {
    this.state.range.min = { inclusive: false, value: gt };
    return this;
  }

  gte(gte: number) {
    this.state.range.min = { inclusive: true, value: gte };
    return this;
  }

  lt(lt: number) {
    this.state.range.min = { inclusive: false, value: lt };
    return this;
  }

  lte(lte: number) {
    this.state.range.min = { inclusive: true, value: lte };
    return this;
  }
}
