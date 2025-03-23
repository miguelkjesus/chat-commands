import { InvocationCallback, Overload } from "./overload";

export class Command<Overloads extends readonly Overload[] = readonly Overload[]> {
  name: string;
  aliases: string[] = [];
  description?: string;
  overloads: Overloads;

  beforeExecute?: InvocationCallback<Overloads[number]>;
  afterExecute?: InvocationCallback<Overloads[number]>;

  constructor(name: string, aliases: string[], overloads: Overloads) {
    this.name = name;
    this.aliases = aliases;
    this.overloads = overloads;
  }

  getSignatures() {
    return this.overloads.map((overload) => `${this.name} ${overload.getSignature()}`);
  }
}
