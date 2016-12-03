import ava from 'ava';
import Timer from '../src/Timer.js';
import TimerManager from '../src/TimerManager.js';

let timer;
let tm;
let registryKey;
let timerId;

let timer2;
let timer3;
let t1;
let t2;
let t3;

ava.beforeEach(() => {
    tm = new TimerManager();

    /* eslint-disable no-undef */
    let keys = Reflect.ownKeys(tm);
    /* eslint-enable no-undef */
    keys.forEach((key) => {
        if (typeof key === 'symbol') {
            let prop = tm[key];
            if (prop.constructor && prop.constructor.name) {
                registryKey = key;
            }
        }
    });

    timer = new Timer({onEach: () => 'each'}, 3);
    timerId = tm.registerTimer(timer);
});

/*
 ██████ ██████  ███████  █████  ████████ ███████
██      ██   ██ ██      ██   ██    ██    ██
██      ██████  █████   ███████    ██    █████
██      ██   ██ ██      ██   ██    ██    ██
 ██████ ██   ██ ███████ ██   ██    ██    ███████
*/

ava('should result private list', test => {
    let tm2 = new TimerManager();
    test.is(tm2.timerRegistry, undefined);
});

ava('should result in empty list', test => {
    let tm2 = new TimerManager();
    test.is(tm2[registryKey].size, 0);
});

/*
██████  ███████  ██████  ██ ███████ ████████ ███████ ██████
██   ██ ██      ██       ██ ██         ██    ██      ██   ██
██████  █████   ██   ███ ██ ███████    ██    █████   ██████
██   ██ ██      ██    ██ ██      ██    ██    ██      ██   ██
██   ██ ███████  ██████  ██ ███████    ██    ███████ ██   ██
*/

ava('should result in expected ids', test => {
    test.is(tm[registryKey].keys().next().value, 10);
});

ava('should search for free ids if max reached', test => {
    tm.lowestFreeId = tm.maxId;

    test.is(tm.registerTimer(new Timer({}, 0)), 0);
    test.is(tm.registerTimer(new Timer({}, 0)), 1);
});

ava('should throw if no ids available', test => {
    tm.maxId = 0;

    test.throws(() => {
        tm.registerTimer(new Timer({}, 0));
    }, RangeError);
});

ava('should not allow duplicate entries for a timer', test => {
    test.is(tm.registerTimer(timer), timerId);
    test.is(tm[registryKey].size, 1);
});

ava('should not allow non instance of timer class', test => {
    test.throws(() => {
        tm.registerTimer([]);
    }, /timer/i);

    test.is(tm[registryKey].size, 1);
});

/*
██████  ███████ ███    ███  ██████  ██    ██ ███████
██   ██ ██      ████  ████ ██    ██ ██    ██ ██
██████  █████   ██ ████ ██ ██    ██ ██    ██ █████
██   ██ ██      ██  ██  ██ ██    ██  ██  ██  ██
██   ██ ███████ ██      ██  ██████    ████   ███████
*/

ava('should result in empty list', test => {
    tm.removeTimer(timerId);
    test.is(tm[registryKey].size, 0);
});

ava('should allow timer instance to be passed instead of id', test => {
    test.notThrows(() => {
        tm.removeTimer(timer);
    });
    test.is(tm[registryKey].size, 0);
});

ava('should not allow non instance of timer class', test => {
    test.throws(() => {
        tm.removeTimer([]);
    }, TypeError);

    test.is(tm[registryKey].size, 1);
});

ava('should not return false if timer is not registered', test => {
    test.is(tm.removeTimer(new Timer({}, 1)), false);
});

ava('should clear all', test => {
    tm.removeAllTimers();
    test.is(tm[registryKey].size, 0);
});

/*
██████  ███████ ████████ ██████  ██ ███████ ██    ██ ███████
██   ██ ██         ██    ██   ██ ██ ██      ██    ██ ██
██████  █████      ██    ██████  ██ █████   ██    ██ █████
██   ██ ██         ██    ██   ██ ██ ██       ██  ██  ██
██   ██ ███████    ██    ██   ██ ██ ███████   ████   ███████
*/

ava('should return timer object if found', test => {
    let t = tm.getTimer(timerId);
    test.is(t, timer);
});

ava('should allow timer instance to be passed instead of id', test => {
    let t;
    test.notThrows(() => {
        t = tm.getTimer(timer);
    });
    test.is(t, timer);
});

ava('should return false if not found', test => {
    let t = tm.getTimer('asdfasdf');
    test.is(t, false);
});

ava('should return false if object not found', test => {
    let t = tm.getTimer(new Timer({}, 1));
    test.is(t, false);
});

/*
████████ ██  ██████ ██   ██
   ██    ██ ██      ██  ██
   ██    ██ ██      █████
   ██    ██ ██      ██  ██
   ██    ██  ██████ ██   ██
*/

function prepExtraTimers(test, runTests) {
    t1 = Math.ceil(Math.random() * 3);
    t2 = Math.ceil(Math.random() * 7);
    t3 = Math.ceil(Math.random() * 2);

    tm.removeAllTimers();

    timer = new Timer({}, t1);
    timer2 = new Timer({}, t2);
    timer3 = new Timer({}, t3);
    tm.registerTimer(timer);
    tm.registerTimer(timer2);
    tm.registerTimer(timer3);

    timer.start();
    timer2.start();

    runTests(test);
}

ava('should tick all running timers', prepExtraTimers, test => {
    tm.tick();
    test.is(timer.ticks, t1 - 1);
    test.is(timer2.ticks, t2 - 1);
});

ava('should not tick paused timers', prepExtraTimers, test => {
    tm.tick();
    test.is(timer3.ticks, t3);
});
