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
