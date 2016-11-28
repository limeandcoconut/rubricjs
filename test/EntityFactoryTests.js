import EntityFactory from '../src/EntityFactory.js';

let expect = require('chai').expect;

/* eslint-disable no-undef */
describe('Entity Factory', function() {

    /*
     ██████ ██████  ███████  █████  ████████ ███████
    ██      ██   ██ ██      ██   ██    ██    ██
    ██      ██████  █████   ███████    ██    █████
    ██      ██   ██ ██      ██   ██    ██    ██
     ██████ ██   ██ ███████ ██   ██    ██    ███████
    */

    describe('Creating an Entity Factory', function() {
        let ef = new EntityFactory();

        it('should result private variable constructorRegistry', function() {
            expect(ef.constructorRegistry).to.be.undefined;

            let found = false;
            let keys = Reflect.ownKeys(ef);
            keys.forEach((key) => {
                if (typeof key === 'symbol') {
                    let prop = ef[key];
                    if (prop.constructor && prop.constructor.name === 'Map') {
                        expect(prop).to.have.property('size').equal(0);
                        found = true;
                    }
                }
            });
            expect(found).to.equal(true);
        });

    });

    /*
     ██████  ██████  ███    ██ ███████ ████████ ██████  ██    ██  ██████ ████████  ██████  ██████  ███████
    ██      ██    ██ ████   ██ ██         ██    ██   ██ ██    ██ ██         ██    ██    ██ ██   ██ ██
    ██      ██    ██ ██ ██  ██ ███████    ██    ██████  ██    ██ ██         ██    ██    ██ ██████  ███████
    ██      ██    ██ ██  ██ ██      ██    ██    ██   ██ ██    ██ ██         ██    ██    ██ ██   ██      ██
     ██████  ██████  ██   ████ ███████    ██    ██   ██  ██████   ██████    ██     ██████  ██   ██ ███████
    */

    describe('On the subject of entity constructors, it', function() {
        let ef = new EntityFactory();

        it('should throw if passed invalid parameters', function() {
            expect(() => {
                ef.registerConstructor(1, () => {});
            }).to.throw(TypeError, /parameter/i);

            expect(() => {
                ef.registerConstructor('foo', 'constructorName');
            }).to.throw(TypeError, /parameter/i);
        });

        it('should store function in registry', function() {
            ef.registerConstructor('test', () => {
                return 'abc';
            });

            let found = false;
            let keys = Reflect.ownKeys(ef);
            keys.forEach((key) => {
                if (typeof key === 'symbol') {
                    let prop = ef[key];
                    if (prop.constructor && prop.constructor.name === 'Map') {
                        expect(prop).to.have.property('size').equal(1);
                        found = true;
                    }
                }
            });
            expect(found).to.equal(true);
        });

        it('should result in a map entry keyed properly', function() {
            let found = false;
            let keys = Reflect.ownKeys(ef);
            keys.forEach((key) => {
                if (typeof key === 'symbol') {
                    let prop = ef[key];
                    if (prop.constructor && prop.constructor.name === 'Map') {
                        expect(prop.has('Test')).to.equal(true);
                        found = true;
                    }
                }
            });
            expect(found).to.equal(true)
        });

        it('should result proxy function calls similar to "createTest" to the stored constructor', function() {
            expect(ef.createTest()).to.equal('abc');
        });

        it('should execute in proper scope', function() {
            ef.registerConstructor('thisTest', function() {return this.constructor.name;});
            let context = ef.createThisTest();
            expect(context).to.equal(EntityFactory.name);
        });

        it('should not trap access to functions that are not stored', function() {
            expect(() => {
                ef.createOtherTest();
            }).to.throw(TypeError);
        });
    });

});
