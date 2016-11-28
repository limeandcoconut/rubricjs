import InputAdapter from '../src/InputAdapter.js';
var expect = require('chai').expect;

/* eslint-disable no-undef */
describe('InputAdapter class', function() {

    describe('Creating Class', function() {

        it('should throw if constructed manually', function() {
            expect(() => {
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

});
