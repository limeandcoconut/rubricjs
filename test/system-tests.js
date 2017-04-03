/* eslint-env mocha, es6 */
const System = require(`../dist/system.js`);
const SubSystem = require(`../dist/sub-system.js`);
const SystemManager = require(`../dist/system-manager.js`);
const expect = require('chai').expect;

describe('System and SubSystem Classes', function() {

    let testSystem;
    let testSubSystem;
    let sm;
    let registryKey;
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
        sm = new SystemManager();

        /* eslint-disable no-undef */
        let keys = Reflect.ownKeys(sm);
        /* eslint-enable no-undef */
        keys.forEach((key) => {
            if (typeof key === 'symbol') {
                let prop = sm[key];
                if (prop.constructor && prop.constructor.name) {
                    registryKey = key;
                }
            }
        });

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

    /*
    ███    ███  █████  ███    ██  █████   ██████  ███████ ██████
    ████  ████ ██   ██ ████   ██ ██   ██ ██       ██      ██   ██
    ██ ████ ██ ███████ ██ ██  ██ ███████ ██   ███ █████   ██████
    ██  ██  ██ ██   ██ ██  ██ ██ ██   ██ ██    ██ ██      ██   ██
    ██      ██ ██   ██ ██   ████ ██   ██  ██████  ███████ ██   ██
    */

    describe('On the subject of the SystemManager, it, ', function() {

        it('should register with expected ids', function() {
            sm.register(testSystem);
            expect(sm[registryKey].keys().next().value).to.equal(testSystem.constructor.name);
        });

        it('should not allow duplicate entries for a system', function() {
            sm.register(testSystem);
            expect(() => {
                sm.register(testSystem);
            }).to.throw(Error, /defined/i);
            expect(sm[registryKey].size).to.equal(1);
        });

        it('should not register non instance of system class', function() {
            expect(() => {
                sm.register([]);
            }).to.throw(TypeError, /system/i);

            expect(sm[registryKey].size).to.equal(0);
        });

        it('should result in empty list after removing systems', function() {
            let systemName = sm.register(testSystem);
            sm.removeSystem(systemName);
            expect(sm[registryKey]).to.have.property('size').equals(0);
        });

        it('should allow system instance to be passed instead of id for removal', function() {
            sm.register(testSystem);
            expect(() => {
                sm.removeSystem(testSystem);
            }).to.not.throw();
            expect(sm[registryKey].size).equal(0);
        });

        it('should return system after removal', function() {
            sm.register(testSystem);
            expect(sm.removeSystem(testSystem)).to.equal(testSystem);
        });

        it('should return false after removal if system was not registered', function() {
            expect(sm.removeSystem(testSubSystem)).to.be.false;
        });

        it('should throw during removal if system or constructor name was passed', function() {
            sm.register(testSystem);
            expect(() => {
                sm.removeSystem(4341);
            }).to.throw(TypeError, /value/i);
        });

        it('should update all registered systems on update', function() {
            sm.register(testSystem);
            sm.update();
            expect(i).to.equal(1);
        });

        it('should not update systems errantly', function() {
            sm.register(testSystem);
            expect(i).to.equal(0);
        });

        it('should clear all properly', function() {
            sm.register(testSystem);
            sm.deleteAllSystems();
            expect(sm[registryKey].size).equal(0);
        });

    });
});
