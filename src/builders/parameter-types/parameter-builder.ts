import type { LiteralParameter, Parameter } from "~/parameters";
import { Builder } from "../builder";

/**
 * A base class for building and configuring command parameters. \
 * All parameter builders inherit this class.
 *
 * @template State
 *    The parameter type being built.
 */
export abstract class ParameterBuilder<State extends Parameter = Parameter> extends Builder<State> {
  /**
   * Sets the display name of the parameter. \
   * This name is displayed in help menus and should convey what the parameter represents.
   *
   * Alternatively, you can also set the name of a parameter like so: `number("example name")`
   *
   * @example
   * const param = number().setName("given amount");
   * console.log(param.getSignature());
   * // "<given amount: number>"
   *
   * @param name
   *    The display name of the parameter. \
   *    This name is displayed in help menus and should convey what the parameter represents.
   * @returns
   *    A builder instance for configuring the parameter.
   */
  setName(name: string) {
    this.state.name = name;
    return this;
  }

  /**
   * Sets the display type of the parameter. \
   * This is displayed in help menus and should convey what values will be accepted by this parameter.
   *
   * @example
   * const param = string("command name").setTypeName("command");
   * console.log(param.getSignature());
   * // "<command name: command>"
   *
   * @param typeName
   *    The display type of the parameter. \
   *    This is displayed in help menus and should convey what values will be accepted by this parameter.
   * @returns
   *    A builder instance for configuring the parameter.
   */
  setTypeName(typeName: string) {
    this.state.typeName = typeName;
    return this;
  }

  /**
   * Sets the description of the parameter. \
   * This is displayed in help menus and should briefly describe the parameter.
   *
   * @example
   * giveMoney.createOverload({
   *   amount: number()
   *     .setDescription("The amount of money to give a player")
   *     .gte(0),
   * });
   *
   * @param description
   *    A brief explanation of the parameter.
   * @returns
   *    A builder instance for configuring the parameter.
   */
  setDescription(description: string) {
    this.state.description = description;
    return this;
  }

  // TODO enforce that optional params cant appear before required params for now
  // TODO make it so that optional params can appear before required params
  //      maybe when parsing, split choices into two trees, one with param one without?

  /**
   * Sets whether a parameter is required or not.
   *
   * **Note:** Optional parameters cannot appear before required parameters!
   *
   * @example
   * smite.createOverload({ player: player().setOptional() });
   * // If this parameter isn't given, it will default to undefined.
   *
   * @param optional
   *    A brief explanation of the parameter.
   * @returns
   *    A builder instance for configuring the parameter.
   */
  setOptional(optional = true) {
    this.state.optional = optional;
    return this;
  }
}

/**
 * Converts a record of parameter builders to a record of its states.
 *
 * This should be used, rather than `StatesFrom<>`, for a record of parameter builders. \
 * This is because `LiteralParameters` need to
 */
export type ParametersFrom<T extends Record<string, ParameterBuilder>> = {
  [K in Extract<keyof T, string>]: T[K] extends ParameterBuilder<infer T>
    ? T extends LiteralParameter<[]>
      ? LiteralParameter<[K]>
      : T
    : never;
};
