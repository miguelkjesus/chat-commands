export abstract class Builder<State> {
  /** @internal */
  public __state = {} as Partial<State>;

  constructor(state: State) {
    this.$set(state);
  }

  protected $set<T>(object: Partial<State>): T {
    this.__state = {
      ...this.__state,
      ...object,
    };
    return this as any as T;
  }
}
