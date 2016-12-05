const ava = require('ava').default;
const System = require('../src/System.js').default;
const SubSystem = require('../src/SubSystem.js').default;

/* eslint-disable no-new */

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

ava.beforeEach(function() {
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

ava('should throw if constructed manually', test => {
    test.throws(() => {
        new System();
    }, /system/i);
});

ava('should throw if update is not overridden', test => {
    class Foo extends System {
    }

    test.throws(() => {
        new Foo();
    }, /system/i);
});

ava('should construct properlly if method is overridden', test => {
    class Bar extends System {
        update() {
        }
    }

    test.notThrows(() => {
        new Bar();
    }, /system/i);
});

/*
██████  ██    ██ ██████  ███████
██   ██ ██    ██ ██   ██ ██
██████  ██    ██ ██████  ███████
██      ██    ██ ██   ██      ██
██       ██████  ██████  ███████
*/

ava('should publish events to queue', test => {
    testSystem.update();
    test.is(testSystem.events.length, 1);
});

ava('should clear events on each update', test => {
    testSystem.update();
    test.is(testSystem.events[0].a, 1);
    testSystem.update();
    test.is(testSystem.events.length, 1);
    test.is(testSystem.events[0].a, 2);
    testSystem.update();
    test.is(testSystem.events.length, 1);
    test.not(testSystem.events[0].a, 2);
});

ava('should manually clear input queue when called', test => {
    testSystem.update();
    test.is(testSystem.events.length, 1);

    testSystem.clearEvents();
    test.is(testSystem.events.length, 0);
});

/*
 ██████ ██████  ███████  █████  ████████ ███████
██      ██   ██ ██      ██   ██    ██    ██
██      ██████  █████   ███████    ██    █████
██      ██   ██ ██      ██   ██    ██    ██
 ██████ ██   ██ ███████ ██   ██    ██    ███████
*/

ava('should throw if constructed manually', test => {
    test.throws(() => {
        new SubSystem();
    }, /system/i);
});

ava('should throw if update is not overridden', test => {
    class Foo extends SubSystem {
    }

    test.throws(() => {
        new Foo();
    }, /system/i);
});

/*
███████ ██    ██ ██████  ███████
██      ██    ██ ██   ██ ██
███████ ██    ██ ██████  ███████
     ██ ██    ██ ██   ██      ██
███████  ██████  ██████  ███████
*/

ava('should throw if subscribe method passed non instance of class System', test => {
    test.throws(() => {
        testSubSystem.subscribe({});
    }, /system/i);
});

ava('should subscribe to events from passed system', test => {
    testSubSystem.subscribe(testSystem);
    testSystem.update();
    testSubSystem.update();
    test.is(testSubSystem.inputQueue.length, 1);
});

ava('should clear input queue on each update', test => {
    testSubSystem.subscribe(testSystem);
    testSystem.update();
    testSubSystem.update();

    test.truthy(testSubSystem.inputQueue[0].a);

    testSystem.update();
    testSubSystem.update();

    test.is(testSubSystem.inputQueue.length, 1);
    test.truthy(testSubSystem.inputQueue[0].a);

    testSystem.update();
    testSubSystem.update();

    test.is(testSubSystem.inputQueue.length, 1);
    test.truthy(testSubSystem.inputQueue[0].a);
});

ava('should clear publisher when unsubscribed', test => {
    testSubSystem.subscribe(testSystem);
    testSystem.update();
    testSubSystem.update();

    testSubSystem.unsubscribe();
    test.is(testSubSystem.publisher, null);
});

ava('should clear input queue when unsubscribed', test => {
    testSubSystem.subscribe(testSystem);
    testSystem.update();
    testSubSystem.update();
    test.is(testSubSystem.inputQueue.length, 1);

    testSubSystem.unsubscribe();
    testSystem.update();
    testSubSystem.update();
    test.is(testSubSystem.inputQueue.length, 0);
});

ava('should manually clear input queue when called', test => {
    testSubSystem.subscribe(testSystem);
    testSystem.update();
    testSubSystem.update();

    test.is(testSubSystem.inputQueue.length, 1);

    testSubSystem.clearQueue();
    test.is(testSubSystem.inputQueue.length, 0);
});
