export type TokenParser<T> = (unparsed: string) => TokenParserResult<T>;

export interface TokenParserResult<T = string> {
  unparsed: string;
  token?: T;
}
