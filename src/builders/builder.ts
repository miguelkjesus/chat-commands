export abstract class Builder<State> {
  public $state: State;

  constructor(state: State) {
    this.$state = state;
  }

  protected add(object: Partial<State>) {
    this.$state = {
      ...this.$state,
      ...object
    }
    return this;
  }
}
