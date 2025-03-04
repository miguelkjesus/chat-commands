import { Parameter } from "./parameter";

// TODO: This shouldn't have all parameter things!
export class LiteralParameter extends Parameter<undefined> {
  parse(): undefined {}

  getSignature(): string {
    if (this.name === undefined) {
      throw new Error("Parameter has no name.");
    }

    return this.name;
  }
}
