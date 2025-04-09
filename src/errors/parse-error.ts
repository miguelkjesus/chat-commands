import { ChatCommandError } from "./command-error";

export class ParseError extends ChatCommandError {
  name = "ParseError";
}
