export class IntegerRange {
  min?: number;
  max?: number;

  constructor({ min, max }: { min?: number; max?: number }) {
    if (min) this.min = Math.floor(min);
    if (max) this.max = Math.floor(max);
  }

  static min(value: number) {
    return new IntegerRange({ min: value });
  }

  static max(value: number) {
    return new IntegerRange({ max: value });
  }

  static eq(value: number) {
    return new IntegerRange({ min: value, max: value });
  }

  static range(min: number, max: number) {
    return new IntegerRange({ min, max });
  }

  contains(value: number): boolean {
    if (this.min && this.min > value) {
      return false;
    }

    if (this.max && this.max < value) {
      return false;
    }

    return true;
  }
}
