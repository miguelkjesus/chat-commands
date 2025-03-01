export abstract class Builder<State extends object = object> {
  // This must stay readonly:
  // Some things rely on this value being modified and not reassigned.
  /** @internal */
  readonly __state: State;

  constructor(state: State) {
    this.__state = state;
  }

  protected __set(object: Partial<State>): this;
  protected __set<Next extends Builder>(object: Partial<StateOf<Next>>): Next;
  protected __set<Next extends Builder = this>(object: any): Next {
    for (const [key, value] of Object.entries(object)) {
      this.__state[key] = value;
    }
    return this as unknown as Next;
  }

  protected __default(object: Partial<State>): this;
  protected __default<Next extends Builder>(object: Partial<StateOf<Next>>): Next;
  protected __default<Next extends Builder = this>(object: any): Next {
    for (const [key, value] of Object.entries(object)) {
      if (this.__state[key] === undefined) this.__state[key] = value;
    }
    return this as unknown as Next;
  }

  protected __mutate(modify: (state: State) => void): this;
  protected __mutate<Next extends Builder>(modify: (state: State) => void): Next;
  protected __mutate<Next extends Builder = this>(modify: (state: State) => void): Next {
    modify(this.__state);
    return this as unknown as Next;
  }

  protected __transform(modify: (state: State) => Partial<State> | undefined): this;
  protected __transform<Next extends Builder>(modify: (state: State) => Partial<StateOf<Next>> | undefined): Next;
  protected __transform<Next extends Builder = this>(modify: (state: State) => any): Next {
    Object.assign(this.__state, modify(this.__state) ?? {});
    return this as unknown as Next;
  }
}

export type StateOf<T extends Builder> = T extends Builder<infer State> ? State : never;
