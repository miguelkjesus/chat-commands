export type TokenParser = (unparsed: string) => TokenParserReturn;

export interface TokenParserReturn {
  unparsed: string;
  token?: string;
}
