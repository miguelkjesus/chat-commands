import { Overload } from "./overload";

export class Command extends Overload<{}> {
  name: string;
  aliases: string[];

  constructor(name: string, aliases: string[] = []) {
    super({});
    this.name = name;
    this.aliases = aliases;
  }
}
