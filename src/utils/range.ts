import { ParseError } from "~/errors";
import { parseNumber } from "./number";

export interface Boundary {
  inclusive: boolean;
  value: number;
}

export class NumberRange {
  min?: Boundary;
  max?: Boundary;

  constructor({ min, max }: { min?: Boundary; max?: Boundary }) {
    this.min = min;
    this.max = max;
  }

  static lt(value: number) {
    return new NumberRange({ max: { inclusive: false, value } });
  }

  static lte(value: number) {
    return new NumberRange({ max: { inclusive: true, value } });
  }

  static gt(value: number) {
    return new NumberRange({ min: { inclusive: false, value } });
  }

  static gte(value: number) {
    return new NumberRange({ min: { inclusive: true, value } });
  }

  static eq(value: number) {
    return new NumberRange({ min: { inclusive: true, value }, max: { inclusive: true, value } });
  }

  static inclusive({ min, max }: { min?: number; max?: number }) {
    let options = {} as { min?: Boundary; max?: Boundary };
    if (min) {
      options.min = { inclusive: true, value: min };
    }
    if (max) {
      options.max = { inclusive: true, value: max };
    }
    return new NumberRange(options);
  }

  static exclusive({ min, max }: { min?: number; max?: number }) {
    let options = {} as { min?: Boundary; max?: Boundary };
    if (min) {
      options.min = { inclusive: false, value: min };
    }
    if (max) {
      options.max = { inclusive: false, value: max };
    }
    return new NumberRange(options);
  }

  static parse(text: string) {
    const rangePattern = /^((?:[-+]?\d+)?)\.\.((?:[-+]?\d+)?)$/;
    const singleValuePattern = /^[-+]?\d+$/;

    const rangeMatch = text.match(rangePattern);
    if (rangeMatch) {
      let [, minStr, maxStr] = rangeMatch;
      let min = minStr ? parseNumber(minStr) : undefined;
      let max = maxStr ? parseNumber(maxStr) : undefined;

      if (min && max && min > max) {
        let temp = min;
        min = max;
        max = temp;
      }

      return NumberRange.inclusive({ min, max });
    }

    const singleValueMatch = text.match(singleValuePattern);
    if (singleValueMatch) {
      let [, valueStr] = singleValueMatch;
      let value = parseNumber(valueStr);

      return NumberRange.eq(value);
    }

    throw new ParseError("Ranges must be in the format N.., ..N, N..M, or N.");
  }

  contains(value: number): boolean {
    if (this.min) {
      if (this.min.inclusive) {
        if (value < this.min.value) return false;
      } else {
        if (value <= this.min.value) return false;
      }
    }

    if (this.max) {
      if (this.max.inclusive) {
        if (value > this.max.value) return false;
      } else {
        if (value >= this.max.value) return false;
      }
    }

    return true;
  }

  toString(): string {
    let str = "";
    if (this.min) {
      str += this.min.inclusive ? "[" : "(";
      str += this.min.value;
    } else {
      str += "(-∞";
    }

    str += ", ";

    if (this.max) {
      str += this.max.value;
      str += this.max.inclusive ? "]" : ")";
    } else {
      str += "∞)";
    }

    return str;
  }
}
