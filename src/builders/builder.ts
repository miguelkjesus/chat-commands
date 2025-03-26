/**
 * A base class for building and configuring objects. \
 * All builders inherit this class.
 *
 * @template State
 *    The state of the object being built.
 */
export abstract class Builder<State extends object = object> {
  /**
   * The current state of the object that is being built.
   *
   * This is intended for internal use only.
   */
  readonly state: State; // This must stay readonly. Some things rely on this value being modified and not reassigned.

  constructor(state: State) {
    this.state = state;
  }
}

/**
 * Extracts the state of a builder.
 */
export type StateOf<T extends Builder> = T extends Builder<infer State> ? State : never;

/**
 * Converts a record of builders to a record of its states.
 */
export type StatesFrom<T extends Record<any, Builder>> = { [K in keyof T]: StateOf<T[K]> };
