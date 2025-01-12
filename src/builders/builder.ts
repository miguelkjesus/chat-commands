export abstract class Builder<State> {
  public _state: State;

  constructor(state: State) {
    this._state = state;
  }

  protected add(object: Partial<State>) {
    this._state = {
      ...this._state,
      ...object
    }
    return this;
  }
}
