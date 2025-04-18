import {
  FilterFromSchema,
  FilterParser,
  IntegerParser,
  IntegerRangeParser,
  ListFromTupleSchema,
  NumberParser,
  NumberRangeParser,
  StringParser,
  Token,
  TokenParser,
  TupleParser,
} from "~/tokens";
import type { IntegerRange } from "./integer-range";
import type { NumberRange } from "./number-range";

export type SchemaType =
  | "string"
  | "number"
  | "integer"
  | "number-range"
  | "integer-range"
  | FilterParser
  | TupleParser;

export interface Schema {
  [Schema.defaultType]?: SchemaType;
}

// prettier-ignore
export type ResolvedSchemaType<T extends SchemaType = SchemaType> =
  T extends "string" ? string :
  T extends "number" ? number :
  T extends "integer" ? number :
  T extends "number-range" ? NumberRange :
  T extends "integer-range" ? IntegerRange :
  T extends FilterParser<infer FilterParserSchema> ? FilterFromSchema<FilterParserSchema> :
  T extends TupleParser<infer ListParserSchema> ? ListFromTupleSchema<ListParserSchema> :
  never;

export type SchemaTypeTokenType<T extends SchemaType = SchemaType> = Token<ResolvedSchemaType<T>>;

// prettier-ignore
export type SchemaTypeParserType<T extends SchemaType = SchemaType> =
  T extends "string" ? StringParser :
  T extends "number" ? NumberParser :
  T extends "integer" ? IntegerParser :
  T extends "number-range" ? NumberRangeParser :
  T extends "integer-range" ? IntegerRangeParser :
  T extends FilterParser ? T :
  T extends TupleParser ? T :
  never;

export namespace Schema {
  export const defaultType = Symbol("Schema.defaultType");

  export function getParser<T extends SchemaType>(schemaType: T, stringTerminator: RegExp): SchemaTypeParserType<T> {
    let parser: TokenParser<unknown>;

    if (schemaType === "string") {
      parser = new StringParser({ terminator: stringTerminator });
    } else if (schemaType === "number") {
      parser = new NumberParser();
    } else if (schemaType === "integer") {
      parser = new IntegerParser();
    } else if (schemaType === "number-range") {
      parser = new NumberRangeParser();
    } else if (schemaType === "integer-range") {
      parser = new IntegerRangeParser();
    } else if (typeof schemaType["parse"] === "function") {
      parser = schemaType as TokenParser<unknown>;
    } else {
      throw new Error(`Unknown parser type "${schemaType}".`);
    }

    return parser as SchemaTypeParserType<T>;
  }
}
