import ava from 'ava';
import Timer from '../src/Timer.js';

let msg;
let timer;
let context;
let ticks;

function setupTimer(test, runTests) {
    msg = '';
    context = {};
    ticks = Math.floor((Math.random() * 5) + 4);
    timer = new Timer({
        onFirst: () => {
            msg = 'first';
        },
        onEach: function() {
            msg = this.ticks;
        },
        onLast: () => {
            msg = 'last';
        },
        context,
    }, ticks);

    runTests(test);
}

/*
 ██████ ██████  ███████  █████  ████████ ███████
██      ██   ██ ██      ██   ██    ██    ██
██      ██████  █████   ███████    ██    █████
██      ██   ██ ██      ██   ██    ██    ██
 ██████ ██   ██ ███████ ██   ██    ██    ███████
*/

ava('should throw if constructed with non function methods in config', test => {
    test.throws(() => {
        /* eslint-disable no-new */
        new Timer({onEach: 'asdfasdf'}, 100);
    }, /function/i);
});

ava('should throw if constructed without duration', test => {
    test.throws(() => {
        /* eslint-disable no-new */
        new Timer({});
    }, /duration/i);
});

ava('should allow 0 duration', test => {
    test.notThrows(() => {
        /* eslint-disable no-new */
        new Timer({}, 0);
    }, /duration/i);
});

ava('should allow duration in config', test => {
    test.is(new Timer({duration: 100}).duration, 100);
});

ava('should override config duration with duration parameter if both are passed', test => {
    test.is(new Timer({duration: 100}, 200).duration, 200);
});

ava('should assign passed callbacks correctly', test => {
    timer = new Timer({
        onFirst: () => 'first',
        onLast: () => 'last',
        onEach: () => 'each',
    }, 100);

    test.is(timer.onFirst(), 'first');
    test.is(timer.onLast(), 'last');
    test.is(timer.onEach(), 'each');
});

ava('should attach ticks to context if passed', setupTimer, test => {
    /* eslint-disable no-new */

    test.not(typeof context.ticks, 'undefined');
    test.is(context.ticks, ticks);
});

/*
███████ ████████  █████  ██████  ████████
██         ██    ██   ██ ██   ██    ██
███████    ██    ███████ ██████     ██
     ██    ██    ██   ██ ██   ██    ██
███████    ██    ██   ██ ██   ██    ██
*/

ava('should toggle running flag when "start()" is called', setupTimer, test => {
    timer.start();
    test.is(timer.running, true);
});

ava('should execute "onFirst" when "start()" is called', setupTimer, test => {
    timer.start();
    test.is(msg, 'first');
});

/*
██████   █████  ██    ██ ███████ ███████
██   ██ ██   ██ ██    ██ ██      ██
██████  ███████ ██    ██ ███████ █████
██      ██   ██ ██    ██      ██ ██
██      ██   ██  ██████  ███████ ███████
*/

ava('should toggle running flag when "pause()" is called', setupTimer, test => {
    timer.start();
    timer.pause();
    test.is(timer.running, false);
});

/*
████████ ██  ██████ ██   ██
   ██    ██ ██      ██  ██
   ██    ██ ██      █████
   ██    ██ ██      ██  ██
   ██    ██  ██████ ██   ██
*/

ava('should execute "onEach" when "tick()" is called', setupTimer, test => {
    timer.tick();
    test.true(/\d/.test(msg));
});

ava('should update context with ticks when "tick()" is called', setupTimer, test => {
    timer.tick();
    test.is(context.ticks, ticks - 1);
    timer.tick();
    test.is(context.ticks, ticks - 2);
});

ava('should execute "onLast" when final "tick()" is called', setupTimer, test => {
    timer.start();
    timer.tick();

    /* eslint-disable no-unmodified-loop-condition */
    while (msg !== 'last') {
        timer.tick();
    }

    test.is(timer.ticks, -1);
    test.is(msg, 'last');
});
