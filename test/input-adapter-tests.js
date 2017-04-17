/* eslint-env mocha, es6 */
const InputAdapter = require('../dist/input-adapter.js');
const expect = require('chai').expect;

describe('On the subject of the InputAdapter class, it, ', function() {

    it('should throw if constructed manually', function() {
        expect(() => {
            /* eslint-disable no-new */
            new InputAdapter();
        }).to.throw(Error, /input\s?adapter/i);
    });

    it('should throw if init is not overridden', function() {
        class Foo extends InputAdapter {
        }

        expect(() => {
            new Foo();
        }).to.throw(Error, /input\s?adapter/i);
    });

    it('should construct properlly if method is overridden', function() {
        class Bar extends InputAdapter {
            init() {
            }
        }

        expect(() => {
            new Bar();
        }).to.not.throw(Error, /input\s?adapter/i);
    });

});
