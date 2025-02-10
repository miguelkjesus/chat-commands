import { Parameter, ParameterType } from "../../parameters/parameter";
import { Builder } from "../builder";



export class ParameterTypeBuilder<T> extends Builder<ParameterType<T>> {
  parse(parse: ParameterType<T>["parse"]) {
    return this.$set({ parse });
  }

  toString(toString: ParameterType<T>["toString"]) {
    return this.$set({ toString });
  }
}

export abstract class ParameterBuilder<T> extends Builder<Parameter<T>> {
  name(name: Parameter<T>["name"]) {
    return this.$set({ name });
  }

  aliases(aliases: Parameter<T>["aliases"]) {
    return this.$set({ aliases });
  }

  optional(optional: boolean) {
    return this.$set({ defaultValue: undefined });
  }

  description(description: Parameter<T>["description"]) {
    return this.$set({ description });
  }

  default(defaultValue: Parameter<T>["defaultValue"]) {
    return this.$set({ defaultValue });
  }
}

export type ParameterBuilderOptions<T> = Omit<Parameter<T>, "type">;
