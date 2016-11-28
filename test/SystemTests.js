import System from '../src/System.js';
import SubSystem from '../src/SubSystem.js';
var expect = require('chai').expect;

/* eslint-disable no-undef, no-new */
describe('System class', function() {

    describe('Creating Class', function() {

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

        describe('On the subject of publications, it ', function() {
            let testSystem;
            let i = 0;

            before(function() {
                class TestSystem extends System {
                    update() {
                        i++;
                        this.publish({a: i});
                    }
                }

                testSystem = new TestSystem();
            });

            it('should publish events to queue', function() {
                testSystem.update();
                expect(testSystem).to.have.property('events').with.length(1);
            });

            it('should clear events on each update', function() {
                expect(testSystem.events[0]).to.have.property('a').equals(1);
                testSystem.update();
                expect(testSystem).to.have.property('events').with.length(1);
                expect(testSystem.events[0]).to.have.property('a').equals(2);
                testSystem.update();
                expect(testSystem).to.have.property('events').with.length(1);
                expect(testSystem.events[0]).to.have.property('a').not.equals(2);
            });

            it('should manually clear input queue when called', function() {
                expect(testSystem.events).to.have.length(1);

                testSystem.clearEvents();
                expect(testSystem.events).to.have.length(0);
            });
        });

    });

    describe('Creating Class SubSystem ', function() {

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

        describe('on the subject of subscriptions, it ', function() {
            let testSubSystem;
            let testSystem;

            before(function() {
                class TestSubSystem extends SubSystem {
                    update() {
                    }
                }

                class TestSystem extends System {
                    update() {
                        this.publish({a: Math.ceil(Math.random * 3)});
                    }
                }

                testSubSystem = new TestSubSystem();
                testSystem = new TestSystem();
            });

            it('should throw if subscribe method passed non instance of class System', function() {
                expect(() => {
                    testSubSystem.subscribe({});
                }).to.throw(TypeError, /system/i);
            });

            it('should subscribe to events from passed system', function() {
                testSubSystem.subscribe(testSystem);
                testSystem.update();
                testSubSystem.update();
                expect(testSubSystem).to.have.property('inputQueue').with.length(1);
            });

            it('should clear input queue on each update', function() {
                expect(testSubSystem.inputQueue[0]).to.have.property('a');
                testSystem.update();
                testSubSystem.update();
                expect(testSubSystem).to.have.property('inputQueue').with.length(1);
                expect(testSubSystem.inputQueue[0]).to.have.property('a');
                testSystem.update();
                testSubSystem.update();
                expect(testSubSystem).to.have.property('inputQueue').with.length(1);
                expect(testSubSystem.inputQueue[0]).to.have.property('a');
            });

            it('should clear publisher when unsubscribed', function() {
                testSubSystem.unsubscribe({});
                expect(testSubSystem).to.have.property('publisher').equal(null);
            });

            it('should clear input queue when unsubscribed', function() {
                testSystem.update();
                testSubSystem.update();
                expect(testSubSystem.inputQueue).to.have.length(0);
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

});
