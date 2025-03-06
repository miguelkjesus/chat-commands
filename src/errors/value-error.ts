import { ChatCommandError } from "./command-error";

export class ValueError extends ChatCommandError {
  name = "ValueError";

  constructor(message: string) {
    super(message);
  }
}
