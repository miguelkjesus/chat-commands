export abstract class Builder<State extends object = object> {
  // This must stay readonly. Some things rely on this value being modified and not reassigned.
  readonly state: State;

  constructor(state: State) {
    this.state = state;
  }
}

export type StateOf<T extends Builder> = T extends Builder<infer State> ? State : never;
