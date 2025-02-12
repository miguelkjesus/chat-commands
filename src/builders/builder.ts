export abstract class Builder<State> {
  // This must stay readonly for current functionality:
  // A few things rely on passing the partial state for later use, and
  // therefore assume that this state will be modified and not replaced.
  readonly __state = {} as Partial<State>;

  constructor(state: State) {
    this.__set(state);
  }

  protected __set(object: Partial<State>) {
    Object.assign(this.__state, object);
    return this;
  }
}
