export class TokenStream {
  unparsed: string;
  readonly quoteChars = ["'", '"'];

  constructor(message: string) {
    this.unparsed = message;
  }

  get isEmpty() {
    return !this.unparsed;
  }

  nextDetails(): { token: string; unparsed: string } {
    this.unparsed = this.unparsed.trimStart();
    if (!this.unparsed) return undefined;

    let token = "";
    let unparsed = "";
    let quote = undefined;
    let escape = false;

    for (let i = 0; i < this.unparsed.length; i++) {
      const ch = this.unparsed[i];

      if (escape) {
        token += ch;
        escape = false;
      } else if (ch === "\\") {
        escape = true;
      } else if (quote) {
        if (ch === quote) {
          quote = undefined;
        } else {
          token += ch;
        }
      } else if (this.quoteChars.includes(ch)) {
        quote = ch;
      } else if (ch === " ") {
        unparsed = this.unparsed.slice(i + 1);
        break;
      } else {
        token += ch;
      }
    }

    return { token, unparsed };
  }

  pop(): string | undefined {
    const { token, unparsed } = this.nextDetails();
    this.unparsed = unparsed;
    return token;
  }

  flush(): string {
    const token = this.unparsed;
    this.unparsed = "";
    return token;
  }

  peek(): string | undefined {
    return this.nextDetails()?.token;
  }

  popRemaining(): string[] {
    let tokens = [];
    let token: string | undefined;
    while ((token = this.peek())) {
      tokens.push(token);
    }
    return tokens;
  }
}

export function tokenize(message: string) {
  return new TokenStream(message).popRemaining();
}
