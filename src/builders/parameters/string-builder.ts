import { ParameterType } from "../../parameters/parameter";
import { ParameterBuilder, ParameterBuilderOptions } from "./parameter-builder";

export class StringParameterType implements ParameterType<string> {
  parse({ unparsed }) {
    return unparsed;
  }

  toString({ name }) {
    return name;
  }
}

export class StringBuilder extends ParameterBuilder<string> {
  constructor(state: ParameterBuilderOptions<string>) {
    super({
      ...state,
      type: new StringParameterType(),
    });
  }

  length(range: { min: number; max: number }) {
    return this.$set({ range });
  }
}
