import { TokenParser, Token } from "../token";
import type { TokenSubstream } from "../stream";

import type { Simplify } from "~/utils/types";
import { type SchemaType, type SchemaTypeTokenType, Schema } from "~/utils/schema";

import { StringParser } from "./string-parser";
import { LiteralParser } from "./literal-parser";

export class FilterParser<const S extends FilterSchema = FilterSchema> extends TokenParser<FilterFromSchema<S>> {
  readonly openingBracket: string;
  readonly closingBracket: string;
  readonly schema: S;

  constructor(openingBracket: string, closingBracket: string, schema: S) {
    super();
    this.openingBracket = openingBracket;
    this.closingBracket = closingBracket;
    this.schema = schema;
  }

  parse(stream: TokenSubstream): Token<FilterFromSchema<S>> {
    const first = stream.popChar();

    if (first !== this.openingBracket) {
      throw stream.error(`Expected an opening bracket: ${this.openingBracket}`).at(0);
    }

    const filter: Filter = {};

    while (true) {
      if (stream.isEmpty()) {
        throw stream.error(`Expected a closing bracket: ${this.closingBracket}`).at(0);
      }

      const keyToken = this.parseKey(stream);
      const operatorToken = this.parseComparisonOperator(stream);
      const valueToken = this.parseValue(stream, keyToken.value);

      const criteria = filter[keyToken.value] ?? new FilterCriteria();

      if (operatorToken.value === "=") {
        criteria.include.push(valueToken);
      } else if (operatorToken.value === "=!") {
        criteria.exclude.push(valueToken);
      } else {
        throw new Error(`Unknown comparison operator "${operatorToken.value}".`);
      }

      filter[keyToken.value] = criteria;

      stream.skipWhitespace();
      const next = stream.peekChar();

      if (next === this.closingBracket) {
        stream.popChar();
        return stream.token(filter as FilterFromSchema<S>);
      } else if (next === ",") {
        stream.popChar();
        continue;
      } else {
        throw new Error(`Expected ${this.closingBracket} or "," but got "${next}".`);
      }
    }
  }

  private parseKey(stream: TokenSubstream): Token<string> {
    if (stream.isEmpty()) {
      throw stream.error("Expected a key.");
    }

    let keyToken = stream.pop(new StringParser({ terminator: /[=!\s]/ })); // Get the name of the key: e.g., "gamemode=..." -> "gamemode"

    if (keyToken.value.length === 0) {
      throw stream.error("Missing key.");
    }

    if (this.schema[keyToken.value] === undefined && this.schema[Schema.defaultType] === undefined) {
      throw stream.error(`Unknown key "${keyToken.value}".`);
    }

    return keyToken;
  }

  private parseComparisonOperator(stream: TokenSubstream): Token<string> {
    if (stream.isEmpty()) {
      throw stream.error("Expected a comparison operator (= or =!).");
    }

    return stream.pop(new LiteralParser(["=", "=!"]));
  }

  private parseValue<Key extends string>(stream: TokenSubstream, key: Key) {
    if (stream.isEmpty()) {
      throw stream.error("Expected a value.");
    }

    let schemaType = this.schema[key] ?? this.schema[Schema.defaultType];

    if (schemaType === undefined) {
      // This should be caught earlier.
      throw new Error(`No parser found for key "${String(key)}".`);
    }

    const parser = Schema.getParser(schemaType, new RegExp(`[\\s,\\${this.closingBracket}]`))!;
    return stream.pop(parser as any) as SchemaTypeTokenType<S[Key]>;
  }
}

// Filter

export interface Filter {
  [key: string]: FilterCriteria<SchemaTypeTokenType<SchemaType>> | undefined;
}

export class FilterCriteria<T> {
  include: T[];
  exclude: T[];

  constructor(include: T[] = [], exclude: T[] = []) {
    this.include = include;
    this.exclude = exclude;
  }

  get lastInclude(): T | undefined {
    return this.include[this.include.length - 1];
  }

  get lastExclude(): T | undefined {
    return this.exclude[this.exclude.length - 1];
  }
}

// Schema

export interface FilterSchema extends Schema {
  [key: string]: SchemaType;
}

// prettier-ignore
export type FilterFromSchema<Schema extends FilterSchema> = Simplify<{
  [Key in keyof Schema as Key extends typeof Schema.defaultType 
    ? Exclude<string, keyof Schema> 
    : Key]?: FilterCriteria<SchemaTypeTokenType<Schema[Key]>>;
}>;

export type SchemaFromFilterParser<Parser extends FilterParser> = Parser extends FilterParser<infer S> ? S : never;
