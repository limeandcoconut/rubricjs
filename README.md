# Rubric.js

## Rubric Underpins Better Reusability In Components

An es6 component, entity, system, framework with a minimal core. Rubric was designed with a verbose syntax and naming scheme that focuses on ease of use and clarity. This standpoint was largely inspired by Douglas Crockford's comment to the effect that code is meant to be "read by humans and incidentally run by machines".

It relies on [Powertrain](https://github.com/limeandcoconut/powertrain) for its' engine and uses babel and mocha in dev.

## Example
There is a barebones 🍖 code example [here](https://github.com/limeandcoconut/rubric-example).
The is a running  demo [here](http://rubric.thejacobsmith.com/), which is pretty boring visually.

## Docs

There is a small jsdoc site [here](http://docs.thejacobsmith.com/module-EntityManager.html).

Better documentation will be coming to the readme _very_ soon. 4/4/17

```js
// Examples to follow shortly
```

## Config File

```js
module.exports = {
    // A useful way to pass things in to input adapters and other utilities
    // In the example implementation mentioned above these keys will have preventDefault() called when they are pressed
    preventKeys: ['up', 'down', 'space', 'left', 'right'],
    // These options will all be passed to Rubric's core engine, Powertrain
    engine: {
        playspeed: 1,
        fps: 60,
    },
    // More on this coming soon 4/4/17
};

```

## Testing Rubric

coming 4/5/17

#### Feedback 🗒
It is greatly appreciated! 🎉
Please hit me up, I'd love to hear what you have to say!

[messagethesmith@gmail.com](messagethesmith@gmail.com)
[https://github.com/limeandcoconut](https://github.com/limeandcoconut)
[@limeandcoconut](https://twitter.com/limeandcoconut)

Cheers!

## TODO:

- [ ] Proxy powertrain pause and stop methods through Rubric
- [ ] Normalize type capitalization in docblocks
- [ ] Normalize punctuation in errors
- [ ] Cover the Single responsibility principle in readme

## Canceled:
#### Plugins in general
- [ ] Consider changing plugin identifiers to uid rather than constructor name
- [ ] Allow plugins to register for multiple hooks
- [ ] Switch to dt in engine. This takes advantage of extra renders

## Usage Stats

[![NPM](https://nodei.co/npm/rubricjs.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/rubricjs/)

## License

MIT, see [LICENSE.md](http://github.com/limeandcoconut/rubricjs/blob/master/LICENSE.md) for details.
