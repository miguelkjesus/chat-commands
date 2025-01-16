export abstract class Builder<State> {
  public $state = {} as Partial<State>;

  constructor(state: State) {
    this.$set(state);
  }

  protected $set(object: Partial<State>) {
    this.$state = {
      ...this.$state,
      ...object,
    };
    return this;
  }
}
