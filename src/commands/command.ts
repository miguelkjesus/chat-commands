import { Overload } from "./overload";

export class Command extends Overload<{}> {
  name: string;
  aliases: string[] = [];

  constructor(name: string, aliases: string[], overloads: Overload[]) {
    super({}, overloads);
    this.name = name;
    this.aliases = aliases;
  }

  getSignatures(): string[] {
    return super.getSignatures().map((signature) => `${this.name} ${signature}`);
  }
}
