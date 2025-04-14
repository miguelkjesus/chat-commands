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

  static inclusive(min: number, max: number) {
    let options = {} as { min?: Boundary; max?: Boundary };
    if (min) {
      options.min = { inclusive: true, value: min };
    }
    if (max) {
      options.max = { inclusive: true, value: max };
    }
    return new NumberRange(options);
  }

  static exclusive(min: number, max: number) {
    let options = {} as { min?: Boundary; max?: Boundary };
    if (min) {
      options.min = { inclusive: false, value: min };
    }
    if (max) {
      options.max = { inclusive: false, value: max };
    }
    return new NumberRange(options);
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
}
