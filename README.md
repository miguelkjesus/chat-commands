# `@mhesus/chat-commands`

An easy command library for Minecraft: Bedrock Edition!

[docs](#) | [npm](https://www.npmjs.com/package/@mhesus/chat-commands) | [github](https://github.com/miguelkjesus/chat-commands)

<!-- TODO docs website -->

## Installation

> [!WARNING]
> You **cannot** install this library yet, as it has not been released! \
> Anything written here is simply written for when it does release in the future.

### Bundler

If you use a bundler in your project, then you can install the package using npm:

```text
npm i @mhesus/chat-commands
```

### No Bundler

I would suggest using a bundler, however if you do not, you can install the project by downloading the most recent release of this package from the `releases` tab in github!

<!--
TODO add proper release instructions once I figure it out.
-->

## How can I use this library?

### `!repeat` Example

```ts
// Lets make a simple command that repeats the player's message a number of times.

const repeat = command("repeat");

// Overloads define the different ways a command can be used!
// We want the player to give a message and the number of times to repeat it:

repeat
  .createOverload({
    times: number().gte(1), // Only accept numbers >= 1!
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

// Now what if we want to also let players just send a message with no number?
// We can allow this with another overload!
// The library is smart enough to know which overload to pick based on what the player inputs!

repeat
  .createOverload({
    message: string().notEmpty(),
  })
  .onExecute((ctx, { message }) => {
    world.sendMessage(message);
  });

// What if we want to supply a success message after any overload has been triggered?
// We can also do this like so:

repeat.afterExecute((ctx) => {
  ctx.player.sendMessage("Successfully repeated your message!");
});

// Finally, the most important bit!
// This must be called at least once to register all the commands that you defined.

startWithPrefix("!");
```
