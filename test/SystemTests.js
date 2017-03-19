/* eslint-env mocha, es6 */
const System = require(`../dist/System.js`);
const SubSystem = require(`../dist/SubSystem.js`);
const expect = require('chai').expect;

describe('System and SubSystem Classes', function() {

    let testSystem;
    let testSubSystem;
    let i;

    class TestSystem extends System {
        update() {
            i++;
            this.publish({a: i});
        }
    }

    class TestSubSystem extends SubSystem {
        update() {
        }
    }

    beforeEach(function() {
        testSystem = new TestSystem();
        testSubSystem = new TestSubSystem();
        i = 0;
    });

    /*
    ███████ ██    ██ ███████ ████████ ███████ ███    ███
    ██       ██  ██  ██         ██    ██      ████  ████
    ███████   ████   ███████    ██    █████   ██ ████ ██
         ██    ██         ██    ██    ██      ██  ██  ██
    ███████    ██    ███████    ██    ███████ ██      ██
    */

    /*
     ██████ ██████  ███████  █████  ████████ ███████
    ██      ██   ██ ██      ██   ██    ██    ██
    ██      ██████  █████   ███████    ██    █████
    ██      ██   ██ ██      ██   ██    ██    ██
     ██████ ██   ██ ███████ ██   ██    ██    ███████
    */

    describe('On the subject of creating Systems, they, ', function() {

        /* eslint-disable no-new */
        it('should throw if constructed manually', function() {
            expect(() => {
                new System();
            }).to.throw(Error, /system/i);
        });

        it('should throw if update is not overridden', function() {
            class Foo extends System {
            }

            expect(() => {
                new Foo();
            }).to.throw(Error, /system/i);
        });

        it('should construct properlly if method is overridden', function() {
            class Bar extends System {
                update() {
                }
            }

            expect(() => {
                new Bar();
            }).to.not.throw(Error, /system/i);
        });
        /* eslint-enable no-new */

    });

    /*
    ██████  ██    ██ ██████  ███████
    ██   ██ ██    ██ ██   ██ ██
    ██████  ██    ██ ██████  ███████
    ██      ██    ██ ██   ██      ██
    ██       ██████  ██████  ███████
    */

    describe('On the subject of publications, they, ', function() {

        it('should publish events to queue', function() {
            testSystem.update();
            expect(testSystem.events).to.have.length(1);
        });

        it('should clear events on each update', function() {
            testSystem.update();
            expect(testSystem.events[0]).to.have.property('a').equal(1);
            testSystem.update();
            expect(testSystem.events).to.have.length(1);
            expect(testSystem.events[0]).to.have.property('a').equal(2);
            testSystem.update();
            expect(testSystem.events).to.have.length(1);
            expect(testSystem.events[0].a).not.equal(2);
        });

        it('should manually clear input queue when called', function() {
            testSystem.update();
            expect(testSystem.events).to.have.length(1);

            testSystem.clearEvents();
            expect(testSystem.events).to.have.length(0);
        });

    });

    /*
     ██████ ██████  ███████  █████  ████████ ███████
    ██      ██   ██ ██      ██   ██    ██    ██
    ██      ██████  █████   ███████    ██    █████
    ██      ██   ██ ██      ██   ██    ██    ██
     ██████ ██   ██ ███████ ██   ██    ██    ███████
    */

    describe('On the subject of creating SubSystems, they, ', function() {

        /* eslint-disable no-new */
        it('should throw if constructed manually', function() {
            expect(() => {
                new SubSystem();
            }).to.throw(Error, /system/i);
        });

        it('should throw if update is not overridden', function() {
            class Foo extends SubSystem {
            }

            expect(() => {
                new Foo();
            }).to.throw(Error, /system/i);
        });
        /* eslint-enable no-new */

    });

    /*
    ███████ ██    ██ ██████  ███████
    ██      ██    ██ ██   ██ ██
    ███████ ██    ██ ██████  ███████
         ██ ██    ██ ██   ██      ██
    ███████  ██████  ██████  ███████
    */

    describe('On the subject of subscriptions, they, ', function() {

        it('should throw if subscribe method passed non instance of class System', function() {
            expect(() => {
                testSubSystem.subscribe({});
            }).to.throw(Error, /system/i);
        });

        it('should subscribe to events from passed system', function() {
            testSubSystem.subscribe(testSystem);
            testSystem.update();
            testSubSystem.update();
            expect(testSubSystem.inputQueue).to.have.length(1);
        });

        it('should clear input queue on each update', function() {
            testSubSystem.subscribe(testSystem);
            testSystem.update();
            testSubSystem.update();

            expect(testSubSystem.inputQueue[0]).to.have.property('a');

            testSystem.update();
            testSubSystem.update();

            expect(testSubSystem.inputQueue).to.have.length(1);
            expect(testSubSystem.inputQueue[0]).to.have.property('a');

            testSystem.update();
            testSubSystem.update();

            expect(testSubSystem.inputQueue).to.have.length(1);
            expect(testSubSystem.inputQueue[0]).to.have.property('a');
        });

        it('should clear publisher when unsubscribed', function() {
            testSubSystem.subscribe(testSystem);
            testSystem.update();
            testSubSystem.update();

            testSubSystem.unsubscribe();
            expect(testSubSystem.publisher).to.equal(null);
        });

        it('should clear input queue when unsubscribed', function() {
            testSubSystem.subscribe(testSystem);
            testSystem.update();
            testSubSystem.update();
            expect(testSubSystem.inputQueue).to.have.length(1);

            testSubSystem.unsubscribe();
            testSystem.update();
            testSubSystem.update();
            expect(testSubSystem.inputQueue).to.have.length(0);
        });

        it('should manually clear input queue when called', function() {
            testSubSystem.subscribe(testSystem);
            testSystem.update();
            testSubSystem.update();

            expect(testSubSystem.inputQueue).to.have.length(1);

            testSubSystem.clearQueue();
            expect(testSubSystem.inputQueue).to.have.length(0);
        });

    });
});
