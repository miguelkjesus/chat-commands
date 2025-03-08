import { LiteralParameter } from "~/parameters/types";
import { ParameterBuilder } from "./parameter-builder";

export class LiteralParameterBuilder<
  const Choices extends readonly string[] = readonly string[],
> extends ParameterBuilder<LiteralParameter<Choices>> {}
