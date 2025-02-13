export type TokenParser<T> = (unparsed: string) => TokenParserReturn<T>;

export interface TokenParserReturn<T = string> {
  unparsed: string;
  token?: T;
}
