# Rubric.js

## Rubric Underpins Better Reusability In Components

An es6 component, entity, system, framework with a minimal core. Rubric was designed with a verbose syntax and naming scheme that focuses on ease of use and clarity. This standpoint was largely inspired by Douglas Crockford's comment to the effect that code is meant to be "read by humans and incidentally run by machines".

It uses babel in dev and AVA, nyc, and cowboy-hat for testing.

## Example
There is a barebones 🍖  code example [here](https://github.com/limeandcoconut/rubric-example).
The is a running demo of it [here](http://rubric.thejacobsmith.com/), which is pretty boring visually.

## Docs

There is a small jsdoc site [here](http://docs.thejacobsmith.com/module-EntityManager.html).

Better documentation will be coming to the readme soon. 11/27/17

```js
// Examples to follow shortly
```

## Config File

```js
module.exports = {
    // A useful way to pass things in to input adapters and other utilities
    // In the example implementation mentioned above these keys will have preventDefault() called when they are pressed
    preventKeys: ['up', 'down', 'space', 'left', 'right'],
    // More on this coming soon 11/27/17
};

```

## Testing Rubric

Testing is done with mocha and chai.

```bash
$ npm run test
```

All tests are written against babel compiled output in the `/dist` directory.

Code coverage with nyc.

```bash
$ npm run coverage
```

Quick `lcov.info` generation for line highlighting in your editor via [cowboy-hat](https://www.npmjs.com/package/cowboy-hat).

```bash
$ npm run cowboy-hat
```

This will watch for file changes and generate lcovs against `/src` for relatively fast coverage line highlighting updates.

## Feedback ✉️
It is greatly appreciated! 🎉
Please hit me up, I'd love to hear what you have to say!

[messagethesmith@gmail.com](messagethesmith@gmail.com)

[https://github.com/limeandcoconut](https://github.com/limeandcoconut)

[@limeandcoconut](https://twitter.com/limeandcoconut)

Cheers!

## TODO:

- [ ] Document and test create method in EntityFactory.
- [ ] Switch to ISC.
- [ ] Update example.
- [ ] Update README.
- [ ] Update Docs.
- [ ] Switch tests to AVA.
- [ ] Cleanout webpack and other bad dependencies
- [ ] Add Symbol string for SystemManager.
- [ ] System update override in constructor probably should not be arrow function?
- [ ] SubSystem should probably throw when instanciated directly?
- [ ] Either change or note the fact that timers' onFirst function doesn't run on the first tick. It runs immediately. Should onFirst or potential onStart be called when unpaused?
- [ ] Improve entityFactory method trapping by making regex match for an uppercase character starting string after "create".

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
