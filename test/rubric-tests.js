/* eslint-env mocha, es6 */
/* eslint-disable no-unused-expressions */
const Rubric = require('../dist/rubric.js');
const InputAdapter = require(`../dist/input-adapter.js`);
const expect = require('chai').expect;

describe('Rubric Class', function() {

    let config = {
        engine: {},
    };

    let rubric;
    let testAdapter;
    let flag;
    let privateKey;

    class TestAdapter extends InputAdapter {
        init() {
            flag = 'yes';
        }
    }

    beforeEach(function() {
        rubric = new Rubric(config);
        testAdapter = new TestAdapter();

        /* eslint-disable no-undef */
        let keys = Reflect.ownKeys(rubric);
        /* eslint-enable no-undef */
        keys.forEach((key) => {
            if (typeof key === 'symbol') {
                let prop = rubric[key];
                if (prop.constructor && prop.engine.constructor.name === 'Powertrain') {
                    privateKey = key;
                }
            }
        });
    });

    /*
     ██████ ██████  ███████  █████  ████████ ███████
    ██      ██   ██ ██      ██   ██    ██    ██
    ██      ██████  █████   ███████    ██    █████
    ██      ██   ██ ██      ██   ██    ██    ██
     ██████ ██   ██ ███████ ██   ██    ██    ███████
    */

    describe('On the subject of creating an instance, it ', function() {

        it('should result private variable engine', function() {
            expect(rubric.engine).to.be.undefined;
        });

        it('should result in private Engine instance', function() {
            let found = false;
            let keys = Reflect.ownKeys(rubric);
            keys.forEach((key) => {
                if (typeof key === 'symbol') {
                    let privateData = rubric[key];
                    if (privateData.engine &&
                        privateData.engine.constructor &&
                        /powertrain/i.test(privateData.engine.constructor.name)
                    ) {
                        expect(privateData.engine).to.have.property('start');
                        found = true;
                    }
                }
            });
            expect(found).to.be.true;
        });

    });

    /*
    ██ ███    ██ ██████  ██    ██ ████████  █████  ██████   █████  ██████  ████████ ███████ ██████  ███████
    ██ ████   ██ ██   ██ ██    ██    ██    ██   ██ ██   ██ ██   ██ ██   ██    ██    ██      ██   ██ ██
    ██ ██ ██  ██ ██████  ██    ██    ██    ███████ ██   ██ ███████ ██████     ██    █████   ██████  ███████
    ██ ██  ██ ██ ██      ██    ██    ██    ██   ██ ██   ██ ██   ██ ██         ██    ██      ██   ██      ██
    ██ ██   ████ ██       ██████     ██    ██   ██ ██████  ██   ██ ██         ██    ███████ ██   ██ ███████
    */

    describe('On the subject of InputAdapters, it ', function() {

        it('should throw if argument is not class instance of InputAdapter', function() {
            expect(() => {
                rubric.addInputAdapter('a');
            }).to.throw(TypeError, /input\s?adapter/i);
        });

        it('should result in a map entry by constructor name', function() {
            rubric.addInputAdapter(testAdapter);

            expect(rubric).to.have.property('inputAdapters');
            expect(rubric.inputAdapters).to.have.property('size').equal(1);
            expect(rubric.inputAdapters.get(TestAdapter.name)).to.equal(testAdapter);
        });

        it('should alias primary adapter for ease', function() {
            rubric.addPrimaryInputAdapter(testAdapter);

            expect(rubric.primaryInput).to.equal(testAdapter);
        });

        it('should throw if argument is not class instance of InputAdapter', function() {
            expect(() => {
                rubric.addPrimaryInputAdapter('a');
            }).to.throw(TypeError, /input\s?adapter/i);
        });

        it('should result in a map entry by constructor name', function() {
            rubric.addPrimaryInputAdapter(testAdapter);

            expect(rubric.inputAdapters).ok;
            expect(rubric.inputAdapters).to.have.property('size').equal(1);
            expect(rubric.inputAdapters.get(TestAdapter.name)).equal(testAdapter);
        });

        it('should init all input adapters when init is called', function() {
            rubric.addInputAdapter(testAdapter);
            rubric.init();
            expect(flag).to.equal('yes');
        });

    });

    /*
    ██    ██ ██████  ██████   █████  ████████ ███████
    ██    ██ ██   ██ ██   ██ ██   ██    ██    ██
    ██    ██ ██████  ██   ██ ███████    ██    █████
    ██    ██ ██      ██   ██ ██   ██    ██    ██
     ██████  ██      ██████  ██   ██    ██    ███████
    */

    describe('On the subject of the update method, it ', function() {

        it('should throw if argument is not a function', function() {
            expect(() => {
                rubric.setUpdate('a');
            }).to.throw(TypeError, /function/i);
        });

        it('should throw if rubric is already running', function() {
            rubric.start();
            expect(() => {
                rubric.setUpdate(() => {});
            }).to.throw(Error, /running/i);
        });

        it('should set method properly', function() {
            let foo = () => {};
            rubric.setUpdate(foo);

            expect(rubric[privateKey].engine).to.have.property('update');
        });

        it('should override existing method', function() {
            let foo = () => {};
            rubric.setUpdate(foo);
            let bar = () => {};
            rubric.setUpdate(bar);

            expect(rubric[privateKey].engine.update).to.equal(bar);
        });
    });
});
