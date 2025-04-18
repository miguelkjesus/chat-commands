import { Style } from "@mhesus/mcbe-colors";

import { type SchemaType, type SchemaTypeTokenType, Schema } from "~/utils/schema";
import { didYouMean, formatAnd } from "~/utils/string";
import type { Simplify } from "~/utils/types";

import type { TokenSubstream } from "../stream";
import { Token, TokenParser } from "../token";

import { LiteralParser } from "./literal-parser";
import { StringParser } from "./string-parser";
import { TupleParser } from "./tuple-parser";
import { WordParser } from "./word-parser";

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
      throw stream.error(`Expected an opening bracket ${Style.white(this.openingBracket)}`).at(-1).state;
    }

    const filter: Filter = {};

    while (true) {
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
        break;
      } else if (next === ",") {
        stream.popChar();
      } else {
        throw stream.error(`Expected ${Style.white(this.closingBracket)} or ${Style.white(",")}.`).at(0).state;
      }
    }

    const filterToken = stream.token(filter as FilterFromSchema<S>);

    for (const [key, dependencies] of Object.entries(this.schema[FilterSchema.dependencies] ?? {})) {
      if (!filterToken.value[key]) continue;

      const missingDependencies = dependencies.filter((dependency) => !filterToken.value[dependency]);
      if (missingDependencies.length === 0) continue;

      throw filterToken.error(
        `Filter variable ${Style.white(key)} also requires ${formatAnd(dependencies, Style.white)} to be defined.`,
      ).state;
    }

    return filterToken;
  }

  private isFilterEnded(stream: TokenSubstream): boolean {
    stream.skipWhitespace();
    const next = stream.peekChar();

    return !next || next === this.closingBracket || next === ",";
  }

  private parseKey(stream: TokenSubstream): Token<string> {
    if (this.isFilterEnded(stream)) {
      throw stream.error("Expected a filter variable.").at(0).state;
    }

    let keyToken = stream.pop(new StringParser({ terminator: /[=!\s\]\,]/ })); // Get the name of the key: e.g., "gamemode=..." -> "gamemode"

    if (keyToken.value.length === 0) {
      throw keyToken.error("Expected a filter variable.").state;
    }

    if (this.schema[keyToken.value] === undefined && this.schema[Schema.defaultType] === undefined) {
      const suggestion = didYouMean(keyToken.value, Object.keys(this.schema), Style.white);
      throw keyToken.error(`Unknown filter variable.${suggestion}`).state;
    }

    return keyToken;
  }

  private parseComparisonOperator(stream: TokenSubstream): Token<string> {
    if (this.isFilterEnded(stream)) {
      throw stream.error(`Expected a comparison operator ${Style.white("=")} or ${Style.white("=!")}.`).at(0).state;
    }

    return stream.pop(new LiteralParser(["=", "=!"]));
  }

  private parseValue<Key extends string>(stream: TokenSubstream, key: Key) {
    if (this.isFilterEnded(stream)) {
      throw stream.error("Expected a value.").at(0).state;
    }

    let schemaType = this.schema[key] ?? this.schema[Schema.defaultType];

    if (schemaType === undefined) {
      // This should be caught earlier.
      throw new Error(`No parser found for key "${String(key)}".`);
    }

    const parser = Schema.getParser(schemaType, new RegExp(`[\\s,\\${this.closingBracket}]`))!;
    if (!(parser instanceof StringParser || parser instanceof FilterParser || parser instanceof TupleParser)) {
      const substream = stream.pop(new WordParser(new RegExp(`[\\s,\\${this.closingBracket}]`))).substream();
      const token = substream.peek(parser as any) as SchemaTypeTokenType<S[Key]>;
      stream.apply(token);
      return token;
    }
    return stream.pop(parser as any) as SchemaTypeTokenType<S[Key]>;
  }
}

// Filter

export interface Filter {
  [key: string]: FilterCriteria<SchemaTypeTokenType> | undefined;
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
  [FilterSchema.dependencies]?: { [key: string]: string[] };
  [key: string]: SchemaType;
}

export namespace FilterSchema {
  export const dependencies = Symbol("Schema.dependencies");
}

// prettier-ignore
export type FilterFromSchema<S extends FilterSchema> = Simplify<{
  [Key in keyof S as Key extends symbol 
    ? Key extends typeof Schema.defaultType 
      ? Exclude<string, keyof S> 
      : never
    : Key]?: FilterCriteria<SchemaTypeTokenType<S[Key]>>;
}>;
