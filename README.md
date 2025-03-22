# `@mhesus/chat-commands`

The **best** way to create commands for Minecraft: Bedrock Edition!

`📄` [Documentation](#) \
`🗞️` [Changelog](./CHANGELOG.md)

<!-- TODO docs website -->

## Contents

- [**Installation**](#installation)
- [**How do I use this library?**](#how-do-i-use-this-library)

## Installation

> [!WARNING]
> You **cannot** install this library yet, as it has not been released! \
> Anything written here is simply written for when it does release in the future.

### Bundler [Recommended]

If you use a bundler in your project, then you can install the package using npm:

```text
npm i @mhesus/chat-commands
```

### No Bundler

You can install the project by downloading the most recent release of this package from the `releases` tab in github!

<!-- TODO add proper release instructions once I figure it out. -->

## How do I use this library?

For full information, read the [documentation](#). However, I will cover a simple example below.

### `!repeat` Example

> Lets make a simple command that repeats the player's message a number of times.

```ts
const repeat = command("repeat");
```

> **Overloads define the different ways a command can be used!** Lets make an overload where the player can first input the number of times to repeat a message, and then the message to be repeated.

```ts
repeat
  .createOverload({
    times: number().gte(1), // Only accept numbers >= 1
    message: string().notEmpty(), // We don't want to allow an empty message!
  })
  .onExecute((ctx, { times, message }) => {
    // We can execute code for this specific overload here!
    // `ctx` contains information about the execution, such as the player who executed it.
    // The second argument contains the arguments the player used.

    for (const i = 0; i < times; i++) {
      world.sendMessage(message);
    }
  });
```

> Now, what if we want to also let players just send a message with no number? \
> We can allow this by adding another overload! \
> The library is smart enough to know which overload to pick based on what the player inputs.

```ts
repeat
  .createOverload({
    message: string().notEmpty(),
  })
  .onExecute((ctx, { message }) => {
    world.sendMessage(message);
  });
```

> Finally, **the most important bit**! \
> This must be called at least once to register all the commands that you defined.

```ts
startWithPrefix("!");
```

<details><summary><i>Full code</i></summary>

```ts
const repeat = command("repeat");

repeat
  .createOverload({
    times: number().gte(1),
    message: string().notEmpty(),
  })
  .onExecute((ctx, { times, message }) => {
    for (const i = 0; i < times; i++) {
      world.sendMessage(message);
    }
  });

repeat
  .createOverload({
    message: string().notEmpty(),
  })
  .onExecute((ctx, { message }) => {
    world.sendMessage(message);
  });

startWithPrefix("!");
```

</details>
