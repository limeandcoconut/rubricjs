import Rubric from '../src/Rubric.js';
import InputAdapter from '../src/InputAdapter.js';

let config = {
    engine: {},
};

var expect = require('chai').expect;

/* eslint-disable no-undef */
describe('Rubric', function() {

    /*
     ██████ ██████  ███████  █████  ████████ ███████
    ██      ██   ██ ██      ██   ██    ██    ██
    ██      ██████  █████   ███████    ██    █████
    ██      ██   ██ ██      ██   ██    ██    ██
     ██████ ██   ██ ███████ ██   ██    ██    ███████
    */

    describe('Creating Rubric', function() {
        let rubric = new Rubric(config);

        it('should result private variable engine', function() {
            expect(rubric.engine).to.be.undefined;
        });

        it('should result in private Engine instance', function() {
            let found = false;
            let keys = Reflect.ownKeys(rubric);
            keys.forEach((key) => {
                if (typeof key === 'symbol') {
                    let privateData = rubric[key];
                    if (privateData.engine && privateData.engine.constructor && /powertrain/i.test(privateData.engine.constructor.name)) {
                        expect(privateData.engine).to.have.property('start');
                        found = true;
                    }
                }
            });
            expect(found).to.equal(true);
        });

    });

    /*
    ██ ███    ██ ██████  ██    ██ ████████  █████  ██████   █████  ██████  ████████ ███████ ██████  ███████
    ██ ████   ██ ██   ██ ██    ██    ██    ██   ██ ██   ██ ██   ██ ██   ██    ██    ██      ██   ██ ██
    ██ ██ ██  ██ ██████  ██    ██    ██    ███████ ██   ██ ███████ ██████     ██    █████   ██████  ███████
    ██ ██  ██ ██ ██      ██    ██    ██    ██   ██ ██   ██ ██   ██ ██         ██    ██      ██   ██      ██
    ██ ██   ████ ██       ██████     ██    ██   ██ ██████  ██   ██ ██         ██    ███████ ██   ██ ███████
    */

    describe('On the subject of InputAdapters, it', function() {
        let rubric = new Rubric(config);

        it('should throw if argument is not class instance of InputAdapter', function() {
            expect(() => {
                rubric.addInputAdapter('a');
            }).to.throw(TypeError);
        });

        it('should result in a map entry by constructor name', function() {
            class TestAdapter extends InputAdapter {
                init() {}
            }

            let testAdapter = new TestAdapter();
            rubric.addInputAdapter(testAdapter);

            expect(rubric).to.have.property('inputAdapters').to.have.property('size').equal(1);
            expect(rubric.inputAdapters.get(TestAdapter.name)).to.equal(testAdapter);
        });

        it('should alias primary adapter for ease', function() {
            class TestAdapter extends InputAdapter {
                init() {}
            }

            let testAdapter = new TestAdapter();
            rubric.addPrimaryInputAdapter(testAdapter);

            expect(rubric).to.have.property('primaryInput').equal(testAdapter);
        });

        it('should throw if argument is not class instance of InputAdapter', function() {
            expect(() => {
                rubric.addPrimaryInputAdapter('a');
            }).to.throw(TypeError);
        });

        it('should result in a map entry by constructor name', function() {
            class TestAdapter extends InputAdapter {
                init() {}
            }

            let testAdapter = new TestAdapter();
            rubric.addPrimaryInputAdapter(testAdapter);

            expect(rubric).to.have.property('inputAdapters').to.have.property('size').equal(1);
            expect(rubric.inputAdapters.get(TestAdapter.name)).to.equal(testAdapter);
        });
    });

});
