const ava = require('ava').default;
const InputAdapter = require('../src/InputAdapter.js').default;

ava('should throw if constructed manually', test => {
    test.throws(() => {
        /* eslint-disable no-new */
        new InputAdapter();
    }, /input\s?adapter/i);
});

ava('should throw if init is not overridden', test => {
    class Foo extends InputAdapter {
    }

    test.throws(() => {
        new Foo();
    }, /input\s?adapter/i);
});

ava('should construct properlly if method is overridden', test => {
    class Bar extends InputAdapter {
        init() {
        }
    }

    test.notThrows(() => {
        new Bar();
    }, /input\s?adapter/i);
});
