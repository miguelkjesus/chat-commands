import { Schema, type SchemaType, type SchemaTypeTokenType } from "~/utils/schema";

import { Simplify } from "~/utils/types";
import type { TokenSubstream } from "../stream";
import { Token, TokenParser } from "../token";
import { StringParser } from "./string-parser";

export class TupleParser<const S extends TupleSchema = TupleSchema> extends TokenParser<S> {
  readonly schema: S;

  constructor(schema: S) {
    super();
    this.schema = schema;
  }

  parse(stream: TokenSubstream): Token<S> {
    if (stream.popChar() !== "[") {
      throw stream.error("Expected an opening bracket: [").at(0).state;
    }

    let index = 0;
    const list = [] as any[] as ListFromTupleSchema<S>;

    while (true) {
      if (stream.isEmpty()) {
        throw stream.error("Expected a closing bracket: ]").at(0).state;
      }

      const valueToken = this.parseValue(stream, index);
      list[index] = valueToken;
      index++;
    }
  }

  parseValue<Index extends number>(stream: TokenSubstream, index: Index) {
    if (stream.isEmpty()) {
      throw stream.error("Expected a value.").state;
    }

    let schemaType = this.schema[index] ?? this.schema[Schema.defaultType];

    if (schemaType === undefined) {
      const guessedToken = stream.pop(new StringParser({ terminator: /[\s,\]]/ }));
      throw guessedToken.error(`No parser found for index ${index}.`).state;
    }

    // FIXME any
    const parser = Schema.getParser(schemaType, /[\s,\]]/)!;
    return stream.pop(parser as any) as SchemaTypeTokenType<S[Index]>;
  }
}

export interface TupleSchema extends Schema {
  [index: number]: SchemaType;
}

// prettier-ignore
export type ListFromTupleSchema<S extends TupleSchema> = Simplify<{
  [Index in keyof S as Index extends symbol
    ? Index extends typeof Schema.defaultType
      ? Exclude<string, keyof S>
      : never
    : Index]?: SchemaTypeTokenType<S[Index] extends SchemaType ? S[Index] : never>;
}>;
