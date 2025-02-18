export abstract class Builder<State extends object> {
  // This must stay readonly:
  // Some things rely on this value being modified and not reassigned.
  /** @internal */
  readonly __state: State;

  constructor(state: State) {
    this.__state = state;
  }

  protected __set(object: Partial<State>) {
    for (const [key, value] of Object.entries(object)) {
      this.__state[key] = value;
    }
    return this;
  }

  protected __default(object: Partial<State>) {
    for (const [key, value] of Object.entries(object)) {
      if (this.__state[key] === undefined) this.__state[key] = value;
    }
    return this;
  }

  protected __mutate(modify: (state: Partial<State>) => void) {
    modify(this.__state);
    return this;
  }

  protected __transform(modify: (state: Partial<State>) => Partial<State> | undefined) {
    Object.assign(this.__state, modify(this.__state) ?? {});
    return this;
  }
}
